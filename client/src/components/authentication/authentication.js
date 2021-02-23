import React from "react";
import "./authentication.scss";

const Authentication = () => {
  return (
    <div className="authentication">
      <h1>nieTask</h1>
      <div className="authentcation-form">
        <h2>Register an account</h2>
        <div className="mail">
          <input placeholder="Please enter your email" />
        </div>
        <div className="name">
          <input placeholder="Please enter full name" />
        </div>
        <div className="password">
          <input placeholder="Please create a password" />
        </div>
       
        <div className="btn-register">
          <button>Register</button>
        </div>
        <hr />
        <p>Already have an account, sign in?</p>
      </div>
    </div>
  );
};

export default Authentication;
