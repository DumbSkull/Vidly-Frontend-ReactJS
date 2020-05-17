import React, { Component } from "react";
import Form from "./common/Form";
import Joi from "joi";
import Input from "./common/Input";
import axios from "axios";
import _ from "lodash";

class Register extends Form {
  state = {
    data: { username: "", password: "", name: "" },
    errors: { username: "", password: "", name: "" },
  };

  emptyError = { username: "", password: "", name: "" };

  schema = {
    username: Joi.string().email().required().label("Username"),
    password: Joi.string().required().min(5).label("Password"),
    name: Joi.string().required().label("Name"),
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (_.isEqual(errors, this.emptyError)) {
      const registerDetails = {
        email: this.state.data.username,
        password: this.state.data.password,
        name: this.state.data.name,
      };
      try {
        const { headers } = await axios.post(
          process.env.REACT_APP_API_URL + "/api/users",
          registerDetails
        );
        localStorage.setItem("token", headers["x-auth-token"]);
        window.location = "/";
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
        <h1>Register</h1>
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
          <Input
            value={this.state.data.name}
            onChange={this.handleOnChange}
            label="Name"
            name="name"
            errors={this.state.errors}
            type="name"
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

export default Register;
