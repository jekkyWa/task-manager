import React, { useEffect, useState } from "react";
import "../authentication.scss";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import WarningIcon from "@material-ui/icons/Warning";

const Register = () => {
  const [statePassword, setStatePassword] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [warningMessage, setWarningMessage] = useState("");
  const [validEmailMessage, setValidEmailMessage] = useState("");
  const [validNameMessage, setValidNameMessage] = useState("");
  const [styleDifficult, setStyleDifficult] = useState("");

  // Изменение validMessage
  const changeHandler = (e) => {
    if (
      e.target.name == "email" &&
      e.target.value.length > 0 &&
      validEmailMessage.length !== 0
    ) {
      setValidEmailMessage("");
    }
    if (
      e.target.name == "name" &&
      e.target.value.length > 0 &&
      validNameMessage.length !== 0
    ) {
      setValidNameMessage("");
    }
    setForm({ ...form, [e.target.name]: e.target.value.replace(/[ ]*/g, "") });
  };

  // Видимость пароля
  const displayPassword = () => {
    let value = statePassword ? false : true;
    setStatePassword(value);
  };

  // Проверка надежности пароля методом Password Strength Meter:
  const reliabilityCheck = () => {
    let len = form.password.length;
    let str = form.password;

    // state меняется только если значение изменилось
    const memo = () => {
      if (cachMess !== warningMessage) setWarningMessage(cachMess);
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

  // Изменения стилей tooltip библиотеки material
  const WarningTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 300,
      fontSize: theme.typography.pxToRem(14),
      border: "1px solid #dadde9",
    },
  }))(Tooltip);

  // Валидация email и full name
  const checkValidForms = () => {
    if (form.email.length == 0) {
      setValidEmailMessage("Enter email");
    } else if (
      !new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i).test(form.email)
    ) {
      setValidEmailMessage("Please enter a valid email");
    } else {
      setValidEmailMessage("");
    }
    if (form.name.length == 0) {
      setValidNameMessage("Enter full name");
      console.log("name_test");
    } else {
      setValidNameMessage("");
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
          <input
            type="email"
            name="email"
            placeholder="Please enter your email"
            onChange={changeHandler}
          />
          <WarningTooltip
            title={validEmailMessage}
            placement="right"
            className={
              !!validEmailMessage ? "warning-icon-active" : "warning-icon-block"
            }
          >
            <WarningIcon
              className="warning-icon-email "
              fontSize="small"
              placement="right"
            />
          </WarningTooltip>
        </div>
        <div className="name">
          <input
            name="name"
            placeholder="Please enter full name"
            onChange={changeHandler}
          />

          <WarningTooltip
            title={validNameMessage}
            placement="right"
            className={
              !!validNameMessage ? "warning-icon-active" : "warning-icon-block"
            }
          >
            <WarningIcon
              className="warning-icon-name"
              fontSize="small"
              placement="right"
            />
          </WarningTooltip>
        </div>
        <div className="password">
          <input
            type={statePassword ? "password" : "text"}
            placeholder="Please create a password"
            name="password"
            value={form.password}
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
        <div className="reliability-block">
          <div className={`reliability-block-one ${styleDifficult}`}>
            <span className="reliability-block-two "></span>
          </div>
          <p className="message-text"> {warningMessage}</p>
        </div>

        <div className="btn-authentication">
          <button onClick={checkValidForms}>Register</button>
        </div>
        <hr />
        <Link to="/login">Already have an account, sign in?</Link>
      </div>
    </div>
  );
};

export default Register;
