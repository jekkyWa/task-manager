import React, { useEffect, useState } from "react";
import "./authentication.scss";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";

const Authentication = () => {
  const [statePassword, setStatePassword] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [warningMessage, setWarningMessage] = useState("");

  const [test, setTest] = useState(" ");

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const displayPassword = () => {
    let value = statePassword ? false : true;
    setStatePassword(value);
  };

  const reliabilityCheck = () => {
    // Функция, чтобы постоянно не менять state
    const memo = () => {
      if (mess !== warningMessage) setWarningMessage(mess);
    };
    const regExp = (reg) => {
      return new RegExp(reg).test(form.password);
    };
    let mess = "";
    let arr = [
      "Ненадежный",
      "Средний",
      "Надежный",
      "Надежный",
      "Очень надежный",
    ];
    let lengthPassword = form.password.length;
    let degreeReliability = 0;
    if (form.password.length <= 8 && lengthPassword !== 0) {
      mess = "Пароль учитывает регистры и должен быть не менее 8 символов";
      memo();
    } else if (lengthPassword !== 0) {
      // Проверка, являются ли все символы одинаковыми
      if (regExp(/^([A-Za-z0-9])\1+$/)) {
        mess = arr[0];
        memo();
      } else {
        if (regExp(/[0-9]+/)) degreeReliability++; // Проверка на наличие чисел
        if (regExp(/[a-z]+/) || regExp(/[а-я]+/)) degreeReliability++; // Проверка на наличие букв
        if (lengthPassword > 14) degreeReliability++; // Проверка длины
        if (regExp(/[A-Z]+/) || regExp(/[А-Я]+/)) degreeReliability++; // Учтены регистры
        mess = arr[degreeReliability];
        memo();
      }
    } else {
      setWarningMessage(" ");
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
        <div className="reliability-block">
          <div className={`reliability-block-one ${test}`}>
            <span className="reliability-block-two "></span>
          </div>
          <p className="message-text"> {warningMessage}</p>
        </div>

        <div className="btn-register">
          <button
            onClick={() => {
              let value = test == "one" ? "two" : "one";
              setTest(value);
            }}
          >
            Register
          </button>
        </div>
        <hr />
        <p>Already have an account, sign in?</p>
      </div>
    </div>
  );
};

export default Authentication;
