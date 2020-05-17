import React, { Component } from "react";
import Form from "./common/Form";
import { getGenres } from "../services/actualGenreService";
import Joi from "joi";
import Input from "./common/Input";
import axios from "axios";
import _ from "lodash";

class MovieForm extends Form {
  // findCurrentMovie = async (property) => {
  //   try {
  //     // if (_.isEqual(this.state.movies, []))
  //     const movies = await this.populateMovies();
  //     if (!_.isEqual(this.state.movies, movies)) this.setState({ movies });
  //     console.log("property: ", property);
  //     console.log("this.props.id: ", this.props.id);
  //     console.log("movies from populate: ", movies);
  //     console.log("this props movies: ", this.state.movies);
  //     console.log("this state data: ", this.state.data);
  //     const movie = this.state.movies.find(
  //       (movie) => movie._id === this.props.id
  //     );
  //     console.log("movie: ", movie);
  //     const data = { ...this.state.data };
  //     if (property === "genre.name") {
  //       console.log(`movie["genre"]["name"]: ${movie["genre"]["name"]}`);
  //       data.genre = movie["genre"]["name"];
  //       this.setState({ data });
  //       return movie["genre"]["name"];
  //     }
  //     data[property] = movie[property];
  //     this.setState({ data });
  //     console.log("movies[", property, "]", movie[property]);
  //     return movie[property];
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // count = 0;

  async componentDidMount() {
    console.log("cdm called!");
    console.log("cdm called lol: ", await this.populateMovies());
    if (this.props.id != "new") {
      const movie = this.state.movies.find(
        (movie) => movie._id === this.props.id
      );
      console.log("movie in cdm: ", movie);
      const data = {};
      data.id = movie._id;
      data.title = movie.title;
      data.genre = movie.genre.name;
      data.numberInStock = movie.numberInStock;
      data.rate = movie.dailyRentalRate;
      console.log("data: ", data);
      this.setState({ data });
    }
  }

  async populateMovies() {
    // if (this.count === 0) {
    //   console.log("cdm called");
    //   try {
    //     const movies =
    const { data } = await axios.get(
      process.env.REACT_APP_API_URL + "/api/movies"
    );
    this.setState({ movies: data });
    return data;
    //     console.log("movies: ", movies);
    //     this.setState({ movies: movies.data });
    //   } catch (err) {
    //     console.log(err);
    //   }
    //   this.count = 1;
    // }
  }

  state = {
    data: { title: "", genre: "", numberInStock: "", rate: "" },
    errors: { title: "", genre: "", numberInStock: "", rate: "" },
  };

  i = 0;
  emptyError = { title: "", genre: "", numberInStock: "", rate: "" };

  schema = {
    title: Joi.string().required().label("Title"),
    genre: Joi.only("Action", "Comedy", "Thriller", "Romance"),
    numberInStock: Joi.number()
      .min(0)
      .max(100)
      .required()
      .label("Number in Stock"),
    rate: Joi.number().required().min(0).max(10).label("Rate"),
    id: Joi.any(),
  };

  generateOption = (genre) => {
    if (genre.name === this.state.data.genre)
      return (
        <option selected key={this.i++}>
          {genre.name}
        </option>
      );
    return <option key={this.i++}>{genre.name}</option>;
  };

  genreList = () => {
    console.log("this.props.genres:", this.props.genres());
    const genreList = this.props.genres();
    const genres = genreList.map((genre) => {
      return this.generateOption(genre);
    });

    return genres;
  };

  handleOnChange = (e) => {
    const data = { ...this.state.data };
    data[e.currentTarget.name] =
      e.currentTarget.name === "numberInStock" ||
      e.currentTarget.name === "rate"
        ? Number(e.currentTarget.value)
        : e.currentTarget.value || "";
    this.setState({ data });
    this.validateProperty(e, data);
  };

  handleSelectChange = (e) => {
    const data = { ...this.state.data };
    data.genre = e.currentTarget.value;
    console.log("data: ", data);
    this.setState({ data });
  };

  handleSubmit = async (e) => {
    console.log("handle submit called");
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    const err = await this.props.checkError(this.state.data);
    console.log("err thing: ", err);
    if (err) {
      const ex = { ...this.emptyError };
      ex.title = err;
      this.setState({ errors: ex });
    } else {
      this.props.settingState(this.state.data);
      this.props.push("/movies");
    }
  };

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <Input
            value={this.state.data.title}
            onChange={this.handleOnChange}
            label="Title"
            name="title"
            errors={this.state.errors}
          />
          <label htmlFor="genre">Genre</label>
          <select
            onChange={this.handleSelectChange}
            className="form-control mb-3"
            id="genre"
          >
            <option hidden>Select a Genre</option>
            {this.genreList()}
          </select>
          <Input
            value={this.state.data.numberInStock}
            onChange={this.handleOnChange}
            label="Number In Stock"
            name="numberInStock"
            errors={this.state.errors}
            type="numberInStock"
          />
          <Input
            value={this.state.data.rate}
            onChange={this.handleOnChange}
            label="Rate"
            name="rate"
            errors={this.state.errors}
            type="rate"
          />
          <button
            disabled={this.handleButtonDisable()}
            className="btn btn-primary"
          >
            Submit
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default MovieForm;
