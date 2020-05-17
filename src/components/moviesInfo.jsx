import React, { Component } from "react";
import MovieForm from "./movieForm";
import axios from "axios";

class MoviesInfo extends Component {
  state = { movies: [], title: "TITLE LOADING..." };
  handleSave = () => {
    this.props.history.push("/movies");
  };

  async componentDidMount() {
    await this.getMovies();
  }

  getMovies = async () => {
    const { data } = await axios.get(
      process.env.REACT_APP_API_URL + "/api/movies"
    );

    this.setState({ movies: data });

    if (this.props.match.params.id !== "new") {
      const movie = data.find(
        (movie) => movie._id === this.props.match.params.id
      );
      this.setState({ title: movie.title });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.props.match.params.id === "new" ? (
          <h1>New Movie</h1>
        ) : (
          <h1>{this.state.title}</h1>
        )}
        <MovieForm
          checkError={this.props.checkError}
          id={this.props.match.params.id}
          genres={this.props.genres}
          movies={this.state.movies}
          settingState={this.props.settingState}
          push={this.props.history.push}
        />
      </React.Fragment>
    );
  }
}

export default MoviesInfo;
