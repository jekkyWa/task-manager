import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// files
import "../authentication.scss";
import { useHttp } from "../../hooks/http.hook";
import InputLogin from "./input-login";
// material
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";

const Login = ({ login }) => {
  const { error, request, clearError } = useHttp();
  const [formLog, setFormLog] = useState({ email: "", password: "" });
  const [validMessageLog, setValidMessageLog] = useState({
    loginMessage: "",
    passwordMessage: "",
    errorFromServer: "",
  });

  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...formLog });
      login(data.token, data.userId);
    } catch (e) {}
  };

  const stateValidLog = (value, type) => {
    setValidMessageLog((prevState) => {
      return { ...prevState, [type]: value };
    });
  };

  // Changing ValidMessageLog.
  const changeHandlerLog = (e) => {
    const check = (name, val) => {
      if (
        e.target.name === name &&
        e.target.value.length > 0 &&
        val.length !== 0
      ) {
        stateValidLog("", "loginMessage");
        stateValidLog("", "passwordMessage");
      }
    };
    // When entering the symbol, the error icon disappears
    check("email", validMessageLog.loginMessage);
    check("password", validMessageLog.passwordMessage);
    // When entering characters, the error is clean
    if (error) {
      clearError();
    }
    // Prohibition of input gap
    setFormLog({
      ...formLog,
      [e.target.name]: e.target.value.replace(/[ ]*/g, ""),
    });
  };

  // Login Validation, Password
  const checkValidForms = () => {
    let valid = 0;
    // Validation Email
    if (formLog.email.length === 0) {
      stateValidLog("Enter login", "loginMessage");
      valid++;
    } else {
      stateValidLog("", "loginMessage");
    }
    // Password Validation
    if (formLog.password.length === 0) {
      stateValidLog("Enter password", "passwordMessage");
      valid++;
    } else {
      stateValidLog("", "passwordMessage");
    }
    // If the "valid" error appears increases and the condition is not executed
    if (valid === 0) {
      loginHandler();
    }
  };

  const { loginMessage, passwordMessage } = validMessageLog;

  return (
    <div className="authentication">
      <div className="logo-icon-aut">
        <div className="icon-aut">
          <DashboardRoundedIcon fontSize="large" />
        </div>
        <h1>Taskood</h1>
      </div>
      <div className="authentication-form">
        <h3
          className={`${
            error || loginMessage || passwordMessage
              ? "log-error"
              : "log-error-hidden"
          }`}
        >
          {error ? error : loginMessage ? loginMessage : passwordMessage}
        </h3>
        <h2>Login an account</h2>
        <InputLogin type="email" func={changeHandlerLog} />
        <InputLogin type="password" func={changeHandlerLog} />
        <div className="btn-authentication btn-login">
          <button onClick={checkValidForms}>Login</button>
        </div>
        <hr />
        <Link to="/signup">You do not have an account, register?</Link>
      </div>
    </div>
  );
};

const mapStateToProps = ({ loginReducer: { login } }) => {
  return { login };
};

export default connect(mapStateToProps, null)(Login);
