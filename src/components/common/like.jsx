import React, { Component } from "react";
import "../../../node_modules/font-awesome/css/font-awesome.min.css";

class Like extends Component {
  isLiked = () => {
    if (this.props.isLiked === true)
      return (
        <i
          onClick={() => {
            this.props.changeLike(this.props.id);
          }}
          style={{ cursor: "pointer" }}
          className="fa fa-heart"
          aria-hidden="true"
        ></i>
      );
    else
      return (
        <i
          onClick={() => {
            this.props.changeLike(this.props.id);
          }}
          style={{ cursor: "pointer" }}
          className="fa fa-heart-o"
          aria-hidden="true"
        ></i>
      );
  };

  render() {
    return <React.Fragment>{this.isLiked()}</React.Fragment>;
  }
}

export default Like;
