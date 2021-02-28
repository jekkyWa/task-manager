import React, {useState} from "react";
import {Link} from "react-router-dom";
import "../authentication.scss";
import {useHttp} from "../../hooks/http.hook";
import {connect} from "react-redux";

const Login = ({login}) => {
  const {error, request, clearError} = useHttp();
  const [formLog, setFormLog] = useState({email: "", password: ""});
  const [validMessageLog, setValidMessageLog] = useState({
    loginMessage: "",
    passwordMessage: "",
    errorFromServer: "",
  });

  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...formLog });
      login(data.token, data.userId);
    } catch (e) {throw new Error(e)}
  };

  const stateValidLog = (value, type) => {
    setValidMessageLog((prevState) => {
      return { ...prevState, [type]: value };
    });
  };

  // Изменение validMessageLog
  const changeHandlerLog = (e) => {
    // При вводе символа, иконка ошибки пропадает
    if (error) {
      clearError()
    }
    if (
        e.target.name === "mail" &&
        e.target.value.length > 0 &&
        validMessageLog.loginMessage.length !== 0
    ) {
      stateValidLog("", "loginMessage");
      stateValidLog("", "passwordMessage");
    }
    if (
        e.target.name === "password" &&
      e.target.value.length > 0 &&
      validMessageLog.passwordMessage.length !== 0
    ) {
      stateValidLog("", "loginMessage");
      stateValidLog("", "passwordMessage");
    }
    setFormLog({
      ...formLog,
      [e.target.name]: e.target.value.replace(/[ ]*/g, ""),
    });
  };

  // Валидация login, password
  const checkValidForms = () => {
    let valid = 0;
    if (formLog.email.length === 0) {
      stateValidLog("Enter login", "loginMessage");
      valid++;
    } else {
      stateValidLog("", "loginMessage");
    }
    if (formLog.password.length === 0) {
      stateValidLog("Enter password", "passwordMessage");
      valid++;
    } else {
      stateValidLog("", "passwordMessage");
    }
    if (valid === 0) {
      loginHandler();
    }
  };

  const { loginMessage, passwordMessage } = validMessageLog;

  return (
    <div className="authentication">
      <h1>nieTask</h1>
      <div className="authentication-form">
        <h3
          className={`${
              error || loginMessage || passwordMessage ? "log-error" : "log-error-hidden"
          }`}
        >
          {error ? error : loginMessage ? loginMessage : passwordMessage}
        </h3>
        <h2>Login an account</h2>
        <div className="mail">
          <input
            name="email"
            placeholder="Please enter your email or name"
            onChange={changeHandlerLog}
          />
        </div>
        <div className="password">
          <input
            placeholder="Please enter your password"
            name="password"
            type="password"
            onChange={changeHandlerLog}
          />
        </div>
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
