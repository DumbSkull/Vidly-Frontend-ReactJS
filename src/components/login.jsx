import React, { Component } from "react";
import Joi from "joi";
import Form from "./common/Form";
import Input from "./common/Input";
import _ from "lodash";
import axios from "axios";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: { username: "", password: "" },
  };

  emptyError = { username: "", password: "" };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().min(5).label("Password"),
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (_.isEqual(errors, this.emptyError)) {
      const loginDetails = {
        email: this.state.data.username,
        password: this.state.data.password,
      };
      try {
        const { data: jwt } = await axios.post(
          process.env.REACT_APP_API_URL + "/api/auth",
          loginDetails
        );
        localStorage.setItem("token", jwt);
        const { state } = this.props.location;

        window.location = state ? state.from.pathname : "/";
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log(error.response);
          const errors = { ...this.emptyError };
          errors.username = error.response.data;
          this.setState({ errors });
        }
      }
    } else {
      console.log("Validation error! ");
    }
  };

  render() {
    return (
      <React.Fragment>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <Input
            value={this.state.data.username}
            onChange={this.handleOnChange}
            label="Username"
            name="username"
            errors={this.state.errors}
          />
          <Input
            value={this.state.data.password}
            onChange={this.handleOnChange}
            label="Password"
            name="password"
            errors={this.state.errors}
            type="password"
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

export default LoginForm;
