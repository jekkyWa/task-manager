import React from "react";
import { Link } from "react-router-dom";
import "../authentication.scss";

const Login = () => {
  return (
    <div className="authentication">
      <h1>nieTask</h1>
      <form className="authentcation-form">
        <h2>Login an account</h2>
        <div className="mail">
          <input
            name="email"
            placeholder="Please enter your email or name"
            required
          />
        </div>
        <div className="password">
          <input placeholder="Please enter your password" name="password" />
        </div>
        <div className="btn-authentication">
          <button type="submit">Login</button>
        </div>
        <hr />
        <Link to="/signup">You do not have an account, register?</Link>
      </form>
    </div>
  );
};

export default Login;
