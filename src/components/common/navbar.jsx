import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import jwtdecode from "jwt-decode";

class NavBar extends Component {
  state = {};

  showUsername = () => {
    try {
      const user = jwtdecode(localStorage.getItem("token"));
      return user.name;
    } catch (error) {}
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to="/movies" className="navbar-brand">
          Vidly
        </Link>
        <div
          className="collapse navbar-collapse container"
          id="navbarNavAltMarkup"
        >
          <div className="navbar-nav my-2">
            <NavLink to="/movies" className="nav-item nav-link">
              Movies
            </NavLink>
            <NavLink to="/customers" className="nav-item nav-link">
              Customers
            </NavLink>
            {!localStorage.getItem("token") && (
              <NavLink to="/login" className="nav-item nav-link">
                Login
              </NavLink>
            )}
            {!localStorage.getItem("token") && (
              <NavLink to="/register" className="nav-item nav-link">
                Register
              </NavLink>
            )}

            {localStorage.getItem("token") && (
              <NavLink
                to="/profile"
                className="nav-item nav-link align-items-right"
              >
                {this.showUsername()}
              </NavLink>
            )}
            {localStorage.getItem("token") && (
              <NavLink to="/logout" className="nav-item nav-link">
                Log out
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
