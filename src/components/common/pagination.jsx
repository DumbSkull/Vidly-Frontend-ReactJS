import React, { Component } from "react";
import PropTypes from "prop-types";
class Pagination extends Component {
  findStartId = (pageNumber) => {
    const startIndex = (pageNumber - 1) * 4;
    return this.props.movies[startIndex]._id;
  };

  showRequiredPages = () => {
    const noPages =
      this.props.genreNo() % 4
        ? Math.floor(this.props.genreNo() / 4) + 1
        : this.props.genreNo() / 4;
    const pages = [];
    for (let i = 1; i <= noPages; i++) {
      if (
        i === this.props.currentActive &&
        this.props.currentActive <= noPages
      ) {
        pages.push(
          <li className="page-item active" key={i}>
            <button
              onClick={() => {
                this.props.updateStartId(this.findStartId(i));
                this.props.changeCurrentActive(i);
              }}
              className="page-link"
            >
              {i}
            </button>
          </li>
        );
      } else {
        pages.push(
          <li className="page-item" key={i}>
            <button
              onClick={() => {
                this.props.updateStartId(this.findStartId(i));
                this.props.changeCurrentActive(i);
              }}
              className="page-link"
            >
              {i}
            </button>
          </li>
        );
      }
    }
    return pages;
  };

  render() {
    return (
      <React.Fragment>
        <nav>
          <ul className="pagination">{this.showRequiredPages()}</ul>
        </nav>
      </React.Fragment>
    );
  }
}

export default Pagination;

Pagination.propTypes = {
  updateStartId: PropTypes.func.isRequired,
  movies: PropTypes.array.isRequired,
  startId: PropTypes.string.isRequired,
  currentActive: PropTypes.number.isRequired,
  changeCurrentActive: PropTypes.func.isRequired,
};
