import { useState } from "react";

// Проверка надежности пароля методом Password Strength Meter:

export const useComplexity = () => {
  const [warningMessageReg, setWarningMessageReg] = useState("");
  const [styleDifficult, setStyleDifficult] = useState("");
  const [formReg, setFormReg] = useState({ email: "", password: "", name: "" });

  const reliabilityCheck = () => {
    let len = formReg.password.length;
    let str = formReg.password;

    // state changes only if the value has changed
    const memo = () => {
      if (cachMess !== warningMessageReg) setWarningMessageReg(cachMess);
      if (cachStyle !== styleDifficult) setStyleDifficult(cachStyle);
    };

    // Function Definition Availability In Password
    const regExpSearch = (reg) => {
      return str.search(reg);
    };

    // Change style and messages with a specific password weight
    const changeDiff = (value) => {
      cachMess = arr[value];
      cachStyle = style[value];
      memo();
    };

    let cachMess = "";
    let cachStyle = "";

    let arr = ["Unreliable", "Middle", "Reliable", "Reliable", "Very reliable"];
    let style = ["one", "two", "three", "four", "five"];

    let rate = 0; // The weight of the password is set to zero.

    if (len <= 6 && len !== 0) {
      cachMess =
        "Password is case sensitive, character sensitive and must be at least 6 characters long";
      cachStyle = "";
      memo();
    } else if (len !== 0) {
      //Check if all characters are equally reliable always 0;
      if (new RegExp(/^([A-Za-z0-9])\1+$/).test(str)) {
        changeDiff(0);
      } else {
        // Password weight increase the size of 4 * Len, where Len - password length
        rate += 4 * len;

        // Attempt to compress the password
        let lenCompress = str.replace(/(.)\1{1,}/g, "$1").length;
        rate -= len - lenCompress;

        // If the password contains at least 3 digits, underwear password weight for 5
        let countNum = str.length - str.replace(/\d+/g, "").length;
        if (countNum >= 3) rate += 5;

        // If the password contains at least 2 characters, we have a password weight by 5
        let countSymb = str.length - str.replace(/[^0-9a-zA-Z]+/g, "").length;
        if (countSymb >= 2) rate += 5;

        // If the password contains letters in the upper and lower case, increase the weight of the password by 10
        if (regExpSearch(/[A-Z]/) !== -1 && regExpSearch(/[a-z]/)) rate += 10;

        // If the password contains letters and numbers increase the weight of the password for 15
        if (
          (regExpSearch(/[A-Z]/) !== -1 || regExpSearch(/[a-z]/)) !== -1 &&
          regExpSearch(/[0-9]/) !== -1
        )
          rate += 15;

        // If the password contains signs and numbers, increase the weight of the password for 15
        if (
          regExpSearch(/[^0-9a-zA-Z]+/g) !== -1 &&
          regExpSearch(/[0-9]/) !== -1
        )
          rate += 15;

        //If the password contains letters and signs, increase the weight of the password by 15
        if (
          (regExpSearch(/[A-Z]/) !== -1 || regExpSearch(/[a-z]/)) !== -1 &&
          regExpSearch(/[^0-9a-zA-Z]+/g) !== -1
        )
          rate += 15;
        // If the password consists of numbers only decrease the password weight by 10
        if (new RegExp(/^\d+$/).test(str)) rate -= 10;

        // If the password consists of letters, we reduce the weight of the password for 10
        if (new RegExp(/^[a-z]+$/).test(str)) rate -= 10;

        // Renting from the rating issue a password reliability
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
  return {
    styleDifficult,
    warningMessageReg,
    reliabilityCheck,
    formReg,
    setFormReg,
  };
};
