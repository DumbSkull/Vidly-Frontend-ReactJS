import React, { Component } from "react";
import { getGenres } from "./../services/actualGenreService";
import _ from "lodash";

class ListGroup extends Component {
  state = {
    genres: [],
  };

  async componentDidMount() {
    if (_.isEqual(this.state.genres, [])) {
      const genres = await getGenres();
      this.setState({ genres });
    }
  }

  isListActive = (genre) => {
    if (this.props.currentGenre === genre)
      return "list-group-item list-group-item-action active";
    else return "list-group-item list-group-item-action";
  };

  returnGenreList = () => {
    const genreList = [];
    genreList.push(
      <a
        href="#"
        key="all"
        onClick={() => {
          this.props.changeCurrentGenre("all");
          this.props.changeCurrentActive(1);
          this.props.setStartIdOfGenre();
        }}
        className={this.isListActive("all")}
      >
        All Genres
      </a>
    );
    genreList.push(
      this.state.genres.map((genre) => {
        return (
          <a
            href="#"
            key={genre._id}
            onClick={() => {
              this.props.changeCurrentGenre(genre._id);
              this.props.changeCurrentActive(1);
              this.props.setStartIdOfGenre();
            }}
            className={this.isListActive(genre._id)}
          >
            {genre.name}
          </a>
        );
      })
    );
    return genreList;
  };

  render() {
    return (
      <React.Fragment>
        <h4>Genres: </h4>

        <div className="list-group">{this.returnGenreList()}</div>
      </React.Fragment>
    );
  }
}

export default ListGroup;
