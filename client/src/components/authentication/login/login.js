import React, {useState} from "react";
import {Link} from "react-router-dom";
import "../authentication.scss";

const Login = () => {
    const [formLog, setFormLog] = useState({login: "", password: ""});
    const [validMessageLog, setValidMessageLog] = useState({
        loginMessage: "",
        passwordMessage: "",
        errorFromServer: "",
    });

    const stateValidLog = (value, type) => {
        setValidMessageLog((prevState) => {
            return {...prevState, [type]: value};
        });
    };

    // Изменение validMessageLog
    const changeHandlerLog = (e) => {
        // При вводе символа, иконка ошибки пропадает
        if (
            e.target.name == "login" &&
            e.target.value.length > 0 &&
            validMessageLog.loginMessage.length !== 0
        ) {
            stateValidLog("", "loginMessage");
            stateValidLog("", "passwordMessage");
        }
        if (
            e.target.name == "password" &&
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
        if (formLog.login.length == 0) {
            stateValidLog("Enter login", "loginMessage");
        } else {
            stateValidLog("", "loginMessage");
        }
        if (formLog.password.length == 0) {
            stateValidLog("Enter password", "passwordMessage");
        } else {
            stateValidLog("", "passwordMessage");
        }
    };

    const {loginMessage, passwordMessage} = validMessageLog;

    return (
        <div className="authentication">
            <h1>nieTask</h1>
            <div className="authentcation-form">
                <h3
                    className={`${
                        loginMessage || passwordMessage ? "log-error" : "log-error-hidden"
                    }`}
                >
                    {loginMessage ? loginMessage : passwordMessage}
                </h3>
                <h2>Login an account</h2>
                <div className="mail">
                    <input
                        name="login"
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
                <hr/>
                <Link to="/signup">You do not have an account, register?</Link>
            </div>
        </div>
    );
};

export default Login;
