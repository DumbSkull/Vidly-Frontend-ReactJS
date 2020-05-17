import React, { Component } from "react";

const Input = (props) => {
  const { label, name, value, onChange, errors } = props;
  let type;
  !props.type ? (type = "text") : (type = props.type);
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        name={name}
        type={type}
        className="form-control"
        id={name}
        placeholder={"Enter " + label}
      />
      {errors[name] && (
        <div className="alert alert-primary" role="alert">
          {errors[name]}
        </div>
      )}
    </div>
  );
};

export default Input;
