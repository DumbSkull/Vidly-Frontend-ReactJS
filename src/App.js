import React, { Component } from "react";
import "./App.css";
import { getMovies } from "./services/actualMovieService";
import MoviesPage from "./components/moviesPage";
import NavBar from "./components/common/navbar";
import { Switch, Route, Redirect } from "react-router-dom";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import MoviesInfo from "./components/moviesInfo";
import LoginForm from "./components/login";
import Register from "./components/register";
import { getGenres } from "./services/actualGenreService";
import axios from "axios";
import Profile from "./components/profile";
import Logout from "./components/logout";
import ProtectedRoute from "./components/common/ProtectedRoute";

class App extends Component {
  state = {
    movies: [],
    genres: [],
    startId: null,
    currentActive: 1,
    currentGenre: "all",
    errors: "",
  };

  async componentDidMount() {
    try {
      const movies = await getMovies();
      const genres = await getGenres();
      console.log("cdm genres:", genres);
      console.log("cdm movies: ", movies);
      this.setState({ movies, genres });
      this.genres = genres;
      this.setState({ startId: movies[0]._id });
    } catch (error) {
      console.log(error);
    }
  }

  checkIfError = async (movieData) => {
    axios.defaults.headers.common["x-auth-token"] = localStorage.getItem(
      "token"
    );
    const originalMovies = [...this.state.movies];
    if (movieData.rate) {
      const genreList = this.state.genres;
      const genre = genreList.find((genre) => movieData.genre === genre.name);
      let movieIndex = this.state.movies.findIndex(
        (movie) => movie._id === movieData.id
      );

      const movies = [...this.state.movies];
      const movie = {};
      movie.dailyRentalRate = movieData.rate;
      movie.genreId = genre._id;
      movie.title = movieData.title;
      movie.numberInStock = movieData.numberInStock;
      if (movieIndex === -1) {
        //if new movie
        try {
          const { data } = await axios.post(
            process.env.REACT_APP_API_URL + "/api/movies",
            movie
          );
        } catch (error) {
          return error.message;
        }
      } else {
        try {
          const { data } = await axios.put(
            process.env.REACT_APP_API_URL + "/api/movies/" + movieData.id,
            movie
          );
        } catch (error) {
          return error.message;
        }
      }
    }
    return "";
  };

  settingState = async (movieData) => {
    axios.defaults.headers.common["x-auth-token"] = localStorage.getItem(
      "token"
    );
    const originalMovies = [...this.state.movies];
    console.log("movie data:", movieData);
    if (movieData.rate) {
      const genreList = this.state.genres;
      const genre = genreList.find((genre) => movieData.genre === genre.name);
      let movieIndex = this.state.movies.findIndex(
        (movie) => movie._id === movieData.id
      );

      const movies = [...this.state.movies];
      const movie = {};
      movie.dailyRentalRate = movieData.rate;
      movie.genreId = genre._id;
      movie.title = movieData.title;
      movie.numberInStock = movieData.numberInStock;

      console.log("movie: ", movie);
      if (movieIndex === -1) {
        //if new movie
        try {
          const { data } = await axios.post(
            process.env.REACT_APP_API_URL + "/api/movies",
            movie
          );
          movieIndex = this.state.movies.length;
          movies.push({});
          movies[this.state.movies.length] = { ...data };

          this.setState({ movies }, () => {
            console.log("state after setting: ", this.state.movies);
          });
        } catch (error) {
          this.setState({ errors: error.message });
          console.log("error set!");
          console.log("this.state.errors: ", this.state.errors);
          this.setState({ movies: originalMovies });
        }
      } else {
        try {
          const { data } = await axios.put(
            process.env.REACT_APP_API_URL + "/api/movies/" + movieData.id,
            movie
          );
          movies[movieIndex] = { ...data };
          this.setState({ movies }, () => {
            console.log("state after setting: ", this.state.movies);
          });
        } catch (error) {
          this.setState({ movies: originalMovies });
        }
      }
    } else this.setState(movieData);
  };

  getGenres = () => {
    console.log("this.state.genres form within: ", this.state.genres);
    return this.state.genres;
  };

  render() {
    return (
      <div>
        <NavBar />

        <main className="container">
          <div></div>
          <Switch>
            <ProtectedRoute
              path="/movies/:id"
              render={(props) => {
                if (localStorage.getItem("token"))
                  return (
                    <MoviesInfo
                      {...props}
                      genres={this.getGenres}
                      movies={this.state.movies}
                      settingState={this.settingState}
                      checkError={this.checkIfError}
                    />
                  );
                else return <Redirect to="/login" />;
              }}
            />
            <Route path="/login" component={LoginForm} />
            <ProtectedRoute path="/logout" component={Logout} />
            <Route path="/profile" component={Profile} />
            <Route path="/register" component={Register} />
            <Route
              path="/movies"
              render={(props) => {
                return (
                  <MoviesPage
                    {...props}
                    movies={this.state.movies}
                    genres={this.state.genres}
                    startId={this.state.startId}
                    currentActive={this.state.currentActive}
                    currentGenre={this.state.currentGenre}
                    settingState={this.settingState}
                  />
                );
              }}
            />
            <Route path="/customers" component={Customers} />
            <Route path="/not-found" component={NotFound} />
            <Route
              path="/"
              exact
              render={(props) => {
                return (
                  <MoviesPage
                    {...props}
                    genres={this.state.genres}
                    movies={this.state.movies}
                    startId={this.state.startId}
                    currentActive={this.state.currentActive}
                    currentGenre={this.state.currentGenre}
                    settingState={this.settingState}
                  />
                );
              }}
            />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
