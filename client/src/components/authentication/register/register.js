import React, { useEffect, useState } from "react";
import "../authentication.scss";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { Link } from "react-router-dom";
import WarningIcon from "@material-ui/icons/Warning";
import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useHttp } from "../../hooks/http.hook";

const Register = () => {
  const [statePassword, setStatePassword] = useState(true);
  const [formReg, setFormReg] = useState({ email: "", password: "", name: "" });
  const [warningMessageReg, setWarningMessageReg] = useState("");
  const [validMessageReg, setValidMessageReg] = useState({
    emailMessage: "",
    passwordMessage: "",
    nameMessage: "",
  });
  const [styleDifficult, setStyleDifficult] = useState("");

  const { request, error, clearError } = useHttp();

  const registerHandler = async () => {
    try {
      await request("/api/auth/register", "POST", { ...formReg });
    } catch (e) {}
  };

  const stateValidReg = (value, type) => {
    setValidMessageReg((prevState) => {
      return { ...prevState, [type]: value };
    });
  };

  // Изменение validMessageReg
  const changeHandlerReg = (e) => {
    // При вводе символа, иконка ошибки пропадает
    if (
      e.target.name == "email" &&
      e.target.value.length > 0 &&
      validMessageReg.emailMessage.length !== 0
    ) {
      stateValidReg("", "emailMessage");
    }
    if (
      e.target.name == "name" &&
      e.target.value.length > 0 &&
      validMessageReg.nameMessage.length !== 0
    ) {
      stateValidReg("", "nameMessage");
    }
    if (
      e.target.name == "password" &&
      e.target.value.length > 0 &&
      validMessageReg.passwordMessage.length !== 0
    ) {
      stateValidReg("", "passwordMessage");
    }
    if (error) {
      clearError();
    }
    setFormReg({
      ...formReg,
      [e.target.name]: e.target.value.replace(/[ ]*/g, ""),
    });
  };

  // Видимость пароля
  const displayPassword = () => {
    let value = statePassword ? false : true;
    setStatePassword(value);
  };

  // Проверка надежности пароля методом Password Strength Meter:
  const reliabilityCheck = () => {
    let len = formReg.password.length;
    let str = formReg.password;

    // state меняется только если значение изменилось
    const memo = () => {
      if (cachMess !== warningMessageReg) setWarningMessageReg(cachMess);
      if (cachStyle !== styleDifficult) setStyleDifficult(cachStyle);
    };

    // Функция определения наличия соответсвий в пароле
    const regExpSearch = (reg) => {
      return str.search(reg);
    };

    // Измениние стиля и сообщения при определенном весе пароля
    const changeDiff = (value) => {
      cachMess = arr[value];
      cachStyle = style[value];
      memo();
    };

    let cachMess = "";
    let cachStyle = "";

    let arr = ["Unreliable", "Middle", "Reliable", "Reliable", "Very reliable"];
    let style = ["one", "two", "three", "four", "five"];

    let rate = 0; // Вес пароля устанавливается равным нулю.

    if (len <= 6 && len !== 0) {
      cachMess =
        "Password is case sensitive, character sensitive and must be at least 6 characters long";
      cachStyle = "";
      memo();
    } else if (len !== 0) {
      // Проверка, если все символы одинаковы надежность всегда 0;
      if (new RegExp(/^([A-Za-z0-9])\1+$/).test(str)) {
        changeDiff(0);
      } else {
        //Вес пароля увеличиваем на величину 4 * len, где len – длина пароля
        rate += 4 * len;

        //Попытка сжатия пароля
        let lenCompress = str.replace(/(.)\1{1,}/g, "$1").length;
        rate -= len - lenCompress;

        // Если пароль содержит не меньше 3 цифр, увелечиваем вес пароля на 5
        let countNum = str.length - str.replace(/\d+/g, "").length;
        if (countNum >= 3) rate += 5;

        // Если пароль содержит не меньше 2 знаков, увелечиваем вес пароля на 5
        let countSymb = str.length - str.replace(/[^0-9a-zA-Z]+/g, "").length;
        if (countSymb >= 2) rate += 5;

        // Если пароль содержит буквы в верхнем и нижнем регистре увеличиваем вес пароля на 10
        if (regExpSearch(/[A-Z]/) !== -1 && regExpSearch(/[a-z]/)) rate += 10;

        // Если пароль содержит буквы и цифры увеличиваем вес пароля на 15
        if (
          (regExpSearch(/[A-Z]/) !== -1 || regExpSearch(/[a-z]/)) !== -1 &&
          regExpSearch(/[0-9]/) !== -1
        )
          rate += 15;

        // Если пароль содержит знаки и цифры увеличиваем вес пароля на 15
        if (
          regExpSearch(/[^0-9a-zA-Z]+/g) !== -1 &&
          regExpSearch(/[0-9]/) !== -1
        )
          rate += 15;

        // Если пароль содержит буквы и знаки увеличиваем вес пароля на 15
        if (
          (regExpSearch(/[A-Z]/) !== -1 || regExpSearch(/[a-z]/)) !== -1 &&
          regExpSearch(/[^0-9a-zA-Z]+/g) !== -1
        )
          rate += 15;
        // Если пароль состоит только из цифр уменьшаем вес пароля на 10
        if (new RegExp(/^\d+$/).test(str)) rate -= 10;

        // Если пароль состоит только из букв уменьшаем вес пароля на 10
        if (new RegExp(/^[a-z]+$/).test(str)) rate -= 10;

        // Отталкиваясь от рейтинга выдаем надежность пароля
        if (rate <= 20) {
          changeDiff(0);
        } else if (rate <= 40) {
          changeDiff(1);
        } else if (rate <= 60) {
          changeDiff(2);
        } else if (rate <= 80) {
          changeDiff(3);
        } else if (rate >= 81) {
          changeDiff(4);
        }
      }
    } else {
      cachMess = "";
      cachStyle = "";
      memo();
    }
  };

  // Валидация email, full name, password
  const checkValidFormsReg = () => {
    let valid = 0;
    if (formReg.email.length == 0) {
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
    if (formReg.name.length == 0) {
      stateValidReg("Enter full name", "nameMessage");
      valid++;
    } else {
      stateValidReg("", "nameMessage");
    }
    if (formReg.password.length == 0) {
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
    if (valid == 0) {
      registerHandler();
    }
  };

  // стили для Tooltip
  const WarningTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 300,
      fontWeight: 700,
      fontSize: theme.typography.pxToRem(14),
      border: "1px solid #dadde9",
    },
  }))(Tooltip);

  useEffect(() => {
    reliabilityCheck();
  }, [formReg.password]);

  const { emailMessage, nameMessage, passwordMessage } = validMessageReg;

  return (
    <div className="authentication">
      <h1>nieTask</h1>
      <div className="authentication-form">
        <h3 className={`${error ? "log-error" : "log-error-hidden"}`}>
          {error}
        </h3>
        <h2>Register an account </h2>
        <div className={`mail ${!!emailMessage ? "mail-error" : ""}`}>
          <input
            type="email"
            name="email"
            placeholder="Please enter your email"
            onChange={changeHandlerReg}
          />
          <WarningTooltip
            title={emailMessage}
            placement="right"
            className={
              !!emailMessage ? "warning-icon-active" : "warning-icon-block"
            }
          >
            <WarningIcon
              className="warning-icon-email "
              fontSize="small"
              placement="right"
            />
          </WarningTooltip>
        </div>
        <div className={`name ${!!nameMessage ? "name-error" : ""}`}>
          <input
            name="name"
            placeholder="Please enter full name"
            onChange={changeHandlerReg}
          />

          <WarningTooltip
            title={nameMessage}
            placement="right"
            className={
              !!nameMessage ? "warning-icon-active" : "warning-icon-block"
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
            <span className="reliability-block-two "></span>
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
