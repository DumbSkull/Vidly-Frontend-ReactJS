import React, { Component } from "react";
import Pagination from "./common/pagination";
import SearchBar from "./common/search";

class Movies extends Component {
  state = {
    searchTerm: "",
  };
  movieCountText() {
    if (this.props.movies.length > 0)
      return <h5>Showing {this.props.genreNo()} movies: </h5>;
    else return <h3>There are no movies!</h3>;
  }

  handleSearchTerm = (searchTerm) => {
    this.setState({ searchTerm });
  };

  showTable(startId) {
    if (this.props.movies.length > 0)
      return (
        <React.Fragment>
          <SearchBar handleSearchTerm={this.handleSearchTerm} />
          <table className="table table-hover">
            <thead>
              <tr>
                <th
                  onClick={() => {
                    this.props.sortMovies("title");
                  }}
                  scope="col"
                >
                  Title
                </th>
                <th
                  onClick={() => {
                    this.props.sortMovies("genre");
                  }}
                  scope="col"
                >
                  Genre
                </th>
                <th
                  onClick={() => {
                    this.props.sortMovies("numberInStock");
                  }}
                  scope="col"
                >
                  Stock
                </th>
                <th
                  onClick={() => {
                    this.props.sortMovies("dailyRentalRate");
                  }}
                  scope="col"
                >
                  Rate
                </th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {this.props.showLimitedMovies(startId, this.state.searchTerm)}
            </tbody>
          </table>
          <Pagination
            movies={this.props.movies}
            startId={this.props.startId}
            currentActive={this.props.currentActive}
            changeCurrentActive={this.props.changeCurrentActive}
            updateStartId={this.props.updateStartId}
            genreNo={this.props.genreNo}
          />
        </React.Fragment>
      );
  }

  render() {
    return (
      <React.Fragment>
        {this.movieCountText()}
        {this.showTable(this.props.startId)}
      </React.Fragment>
    );
  }
}

export default Movies;
