import React, { Component } from "react";
import Movies from "./movies";
import ListGroup from "./listgroup";
import axios from "axios";
import Like from "./common/like";

import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBar from "./common/search";

class MoviesPage extends Component {
  state = {
    warningClose: 0,
  };
  sortMovies = (category) => {
    console.log("sortMovies called");
    let movies = [...this.props.movies];
    movies = _.sortBy(movies, (movie) => {
      if (category === "genre") {
        console.log("category is genre");
        return movie.genre.name;
      }
      console.log("category is other category");
      return movie[category];
    });
    console.log("sorted movies: ", movies);
    this.props.settingState({
      movies,
      startId: movies[0]._id,
      currentActive: 1,
    });
  };

  genreNo = () => {
    if (this.props.currentGenre === "all") return this.props.movies.length;
    else {
      const movies = this.props.movies.filter((movie) => {
        if (movie.genre._id === this.props.currentGenre) return movie;
      });
      return movies.length;
    }
  };

  updateCurrentGenre = (id) => {
    this.props.settingState({ currentGenre: id, currentActive: 1 });
  };

  changeCurrentActive = (i) => {
    this.props.settingState({ currentActive: i });
  };

  setStartIdOfGenre = () => {
    try {
      if (this.props.currentGenre === "all") {
        this.props.settingState({ startId: this.props.movies[0]._id });
      } else {
        const index = this.props.movies.findIndex(
          (movie) => movie.genre._id === this.props.currentGenre
        );

        this.props.settingState({ startId: this.props.movies[index]._id });
      }
    } catch (err) {
      console.log("No Movies Available");
    }
  };

  showLimitedMovies = (startId, searchTerm) => {
    let movies;
    if (!searchTerm) {
      if (!startId) startId = this.startId;

      if (this.props.currentGenre === "all") {
        let count = 0;
        movies = this.props.movies.filter((movie) => {
          if (movie._id === startId) {
            count = 1;
            return movie;
          } else if (count >= 1 && count < 4) {
            count++;
            return movie;
          }
        });
        console.log("movies after filetr:", movies);
      } else {
        let count = 0;
        try {
          startId = this.props.movies.find(
            (movie) => movie.genre._id === this.props.currentGenre
          )._id;

          movies = this.props.movies.filter((movie) => {
            if (movie.genre._id === this.props.currentGenre) {
              if (movie._id === startId) {
                console.log("movie with the same genre: ", movie);
                count = 1;
                return movie;
              } else if (
                count >= 1 &&
                count < 4 &&
                movie.genre._id === this.props.currentGenre
              ) {
                count++;
                return movie;
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      //movie.title.indexOf(searchTerm)===-1? false : true
      let count = 0;

      try {
        startId = this.props.movies.find((movie) => {
          if (
            movie.title.toLowerCase().search(searchTerm.toLowerCase()) === -1
              ? false
              : true
          ) {
            return movie;
          }
        })._id;
      } catch (err) {
        console.log("no movies!");
      }

      movies = this.props.movies.filter((movie) => {
        if (
          movie.title.toLowerCase().search(searchTerm.toLowerCase()) === -1
            ? false
            : true
        ) {
          if (movie._id === startId) {
            count = 1;
            return movie;
          } else if (count >= 1 && count < 4) {
            count++;
            return movie;
          }
        }
      });
    }
    try {
      movies = movies.map((element) => (
        <tr key={element._id}>
          <td>
            <Link to={`/movies/${element._id}`}>{element.title}</Link>
          </td>
          <td>{element.genre.name}</td>
          <td>{element.numberInStock}</td>
          <td>{element.dailyRentalRate}</td>
          <td>
            <Like
              isLiked={element.isLiked}
              changeLike={this.changeLikeStatus}
              id={element._id}
            />
          </td>
          {localStorage.getItem("token") && (
            <td>
              <button
                className="btn btn-danger"
                onClick={this.deleteMovie(element._id)}
              >
                Delete
              </button>
            </td>
          )}
        </tr>
      ));
      return movies;
    } catch (error) {
      console.log(error);
    }
  };

  deleteMovie = (id) => {
    return async () => {
      const index = this.props.movies.findIndex((el) => {
        if (el._id === id) return el;
      });
      const originalMovies = [...this.props.movies];
      const movies = [...this.props.movies];
      let startId;
      if (id === this.props.startId && movies.length !== 1) {
        try {
          startId = movies[index + 1]._id;
        } catch (err) {
          startId = movies[index - 4]._id;
          this.props.settingState({
            currentActive: this.props.currentActive - 1,
          });
        }
      } else startId = this.props.startId;
      movies.splice(index, 1);
      this.updateStartId(startId);
      this.props.settingState({ movies });
      try {
        const { data } = await axios.delete(
          process.env.REACT_APP_API_URL + "/api/movies/" + id
        );
        console.log(data);
      } catch (error) {
        console.log(error);
        this.setState({ movies });
      }
    };
  };

  changeLikeStatus = (id) => {
    const movies = [...this.props.movies];
    const index = movies.findIndex((movie) => movie._id === id);
    movies[index] = { ...movies[index] };
    movies[index].isLiked = !movies[index].isLiked;
    this.props.settingState({ movies });
  };

  changeCurrentGenre = (id) => {
    this.props.settingState({ currentGenre: id });
  };

  updateStartId = (startId) => {
    this.props.settingState({ startId });
  };

  render() {
    return (
      <React.Fragment>
        <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 rounded mx-auto text-white text-center bg-dark mb-5">
          <h1 class="display-4">Welcome to Vidly</h1>
          <p class="lead">This website stores details of movies.</p>
        </div>
        <div className="row">
          <div className="col-4">
            <ListGroup
              genres={this.props.genres}
              changeCurrentGenre={this.changeCurrentGenre}
              changeCurrentActive={this.changeCurrentActive}
              setStartIdOfGenre={this.setStartIdOfGenre}
              currentGenre={this.props.currentGenre}
            />
          </div>
          <div className="col-8">
            {localStorage.getItem("token") && (
              <React.Fragment>
                <h4>Add a new movie: </h4>
                <Link to="/movies/new">
                  <button className="btn btn-primary mb-4">New Movie</button>
                </Link>
              </React.Fragment>
            )}
            {!localStorage.getItem("token") && !this.state.warningClose && (
              <div
                class="alert alert-warning alert-dismissible fade show"
                role="alert"
              >
                <strong>Warning!</strong> You should login to make use of most
                of the features in this website.
                <button
                  onClick={() => {
                    console.log("clicked!");
                    this.setState({ warningClose: 1 });
                  }}
                  type="button"
                  class="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            <h4 class="text-center">Movies in the database </h4>

            <Movies
              movies={this.props.movies}
              startId={this.props.startId}
              currentActive={this.props.currentActive}
              currentGenre={this.props.currentGenre}
              deleteMovie={this.deleteMovie}
              updateStartId={this.updateStartId}
              changeCurrentActive={this.changeCurrentActive}
              changeLikeStatus={this.changeLikeStatus}
              showLimitedMovies={this.showLimitedMovies}
              genreNo={this.genreNo}
              sortMovies={this.sortMovies}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MoviesPage;
