import React, { useEffect, useState } from "react";
import "./authentication.scss";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";

const Authentication = () => {
  const [statePassword, setStatePassword] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [warningMessage, setWarningMessage] = useState("");

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const displayPassword = () => {
    let value = statePassword ? false : true;
    setStatePassword(value);
  };

  const reliabilityCheck = () => {
    const memo = () => {
      if (_err !== warningMessage) setWarningMessage(_err);
    };
    let _err = "";
    if (form.password.length < 9 && form.password.length !== 0) {
      _err = "Пароль должен быть не менее 8 символов";
      memo();
    } else {
      _err = "Низкий";
      memo();
    }
  };

  useEffect(() => {
    reliabilityCheck();
  }, [form.password]);

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
          <input
            type={statePassword ? "password" : "text"}
            placeholder="Please create a password"
            name="password"
            onChange={changeHandler}
          />
          <div className="eye-icon-block">
            <VisibilityIcon
              onClick={displayPassword}
              className={statePassword ? "eye-icon-hidden" : "eye-icon"}
            />
            <VisibilityOutlinedIcon
              onClick={displayPassword}
              className={
                statePassword ? "eye-icon eye-icon-vis" : "eye-icon-hidden"
              }
            />
          </div>
        </div>
        <div className="d">
          <div className="a">
            <span className="b"></span>
          </div>
          <p className="c"></p>
        </div>
        <p>{warningMessage}</p>
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
