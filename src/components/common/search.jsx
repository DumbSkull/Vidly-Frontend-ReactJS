import React, { Component } from "react";

class SearchBar extends Component {
  state = {
    searchValue: "",
  };

  handleOnChange = (e) => {
    console.log("handle change on search bar: ", e.currentTarget.value);
    this.props.handleSearchTerm(e.currentTarget.value);
  };

  render() {
    return (
      <React.Fragment>
        <input
          onChange={this.handleOnChange}
          type="text"
          className="form-control mt-2 mb-4"
          id="searchBar"
          placeholder="Search"
        />
      </React.Fragment>
    );
  }
}

export default SearchBar;
