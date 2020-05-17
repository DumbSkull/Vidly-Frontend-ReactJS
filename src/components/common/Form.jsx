import React, { Component } from "react";
import _ from "lodash";
import Joi from "joi";

class Form extends Component {
  validate = (data) => {
    const result = Joi.validate(data, this.schema, { abortEarly: false });
    if (!result.error) {
      return this.emptyError;
    }
    const errObj = {};
    for (let key of result.error.details) {
      errObj[key.path[0]] = key.message;
    }

    return errObj;
  };

  validateProperty = (e, data) => {
    const errors = { ...this.state.errors };
    errors[e.currentTarget.name] = this.validate(data)[e.currentTarget.name];
    this.setState({ errors });
  };

  handleOnChange = (e) => {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value || "";
    this.setState({ data });
    this.validateProperty(e, data);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
  };

  handleButtonDisable = () => {
    const err = this.validate(this.state.data);
    if (_.isEqual(err, this.emptyError)) return 0;
    return 1;
  };
}

export default Form;
