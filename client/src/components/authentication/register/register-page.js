import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// files
import { useHttp } from "../../hooks/http.hook";
import { useComplexity } from "../hooks/complexity-password.hook";
import { WarningTooltip } from "./tooltip.styles";
import WarningTooltipCustom from "./warningTooltipCustom";
import "../authentication.scss";
// material
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import WarningIcon from "@material-ui/icons/Warning";
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";

const Register = () => {
  const [statePassword, setStatePassword] = useState(true);
  const [validMessageReg, setValidMessageReg] = useState({
    emailMessage: "",
    passwordMessage: "",
    nameMessage: "",
  });
  const [err, setErr] = useState("");
  // Connecting custom hooks
  const {
    styleDifficult,
    warningMessageReg,
    reliabilityCheck,
    formReg,
    setFormReg,
  } = useComplexity();
  const { request, error, clearError } = useHttp();

  const registerHandler = async () => {
    // If the password is weak, the registration request is not sent, weak password is Middle or Unreliable
    if (warningMessageReg !== "Middle" && warningMessageReg !== "Unreliable") {
      try {
        await request("/api/auth/register", "POST", { ...formReg });
      } catch (e) {}
      return;
    }
    setErr("Пароль слишком простой");
  };

  const stateValidReg = (value, type) => {
    setValidMessageReg((prevState) => {
      return { ...prevState, [type]: value };
    });
  };

  // Password visibility
  const displayPassword = () => {
    let value = !statePassword;
    setStatePassword(value);
  };

  // Changing ValidMessageReg.
  const changeHandlerReg = (e) => {
    // Wrapper for condition
    const check = (name, type, val) => {
      if (
        e.target.name === name &&
        e.target.value.length > 0 &&
        val.length !== 0
      ) {
        stateValidReg("", type);
      }
    };
    //When entering the symbol, the error icon disappears
    check("email", "emailMessage", validMessageReg.emailMessage);
    check("name", "nameMessage", validMessageReg.nameMessage);
    check("password", "passwordMessage", validMessageReg.passwordMessage);
    // When entering characters, the error is clean
    if (error) {
      clearError();
    }
    setErr("");
    // Prohibition of input gap
    setFormReg({
      ...formReg,
      [e.target.name]: e.target.value.replace(/[ ]*/g, ""),
    });
  };

  // Validation Email, Full Name, Password
  const checkValidFormsReg = () => {
    let valid = 0;
    // Checking Email
    if (formReg.email.length === 0) {
      stateValidReg("Enter email", "emailMessage");
      valid++;
    } else if (
      !new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i).test(
        formReg.email
      )
    ) {
      stateValidReg("Please enter a valid email", "emailMessage");
      valid++;
    } else {
      stateValidReg("", "emailMessage");
    }
    // Check Name
    if (formReg.name.length === 0) {
      stateValidReg("Enter full name", "nameMessage");
      valid++;
    } else {
      stateValidReg("", "nameMessage");
    }
    // Checking Password
    if (formReg.password.length === 0) {
      stateValidReg("Enter password", "passwordMessage");
      valid++;
    } else if (formReg.password.length < 6) {
      stateValidReg(
        "Minimum password length less than 6 characters",
        "passwordMessage"
      );
      valid++;
    } else {
      stateValidReg("", "passwordMessage");
    }
    // If the "valid" error appears increases and the condition is not executed
    if (valid === 0) {
      registerHandler();
    }
  };

  useEffect(() => {
    reliabilityCheck();
  }, [formReg.password]);

  useEffect(() => {
    setErr(error);
  }, [error]);

  const { emailMessage, nameMessage, passwordMessage } = validMessageReg;

  return (
    <div className="authentication">
      <div className="logo-icon-aut">
        <div className="icon-aut">
          <DashboardRoundedIcon fontSize="large" />
        </div>
        <h1>Taskood</h1>
      </div>
      <div className="authentication-form">
        <h3 className={`${err ? "log-error" : "log-error-hidden"}`}>{err}</h3>
        <h2>Register an account </h2>
        <WarningTooltipCustom
          type="email"
          value={emailMessage}
          func={changeHandlerReg}
        />
        <WarningTooltipCustom
          type="name"
          value={nameMessage}
          func={changeHandlerReg}
        />
        <div
          className={`password ${!!passwordMessage ? "password-error" : ""}`}
        >
          <input
            type={statePassword ? "password" : "text"}
            placeholder="Please create a password"
            name="password"
            value={formReg.password}
            onChange={changeHandlerReg}
          />
          <div>
            <WarningTooltip
              title={passwordMessage}
              placement="right"
              className={
                !!passwordMessage ? "warning-icon-active" : "warning-icon-block"
              }
            >
              <WarningIcon
                className="warning-icon-name"
                fontSize="small"
                placement="right"
              />
            </WarningTooltip>
          </div>
          <div
            className={
              !!passwordMessage ? "warning-icon-block" : "eye-icon-block"
            }
          >
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
        <div className="reliability-block">
          <div className={`reliability-block-one ${styleDifficult}`}>
            <span className="reliability-block-two " />
          </div>
          <p className="message-text"> {warningMessageReg}</p>
        </div>
        <div className="btn-authentication">
          <button onClick={checkValidFormsReg}>Register</button>
        </div>
        <hr />
        <Link to="/login">Already have an account, sign in?</Link>
      </div>
    </div>
  );
};

export default Register;
