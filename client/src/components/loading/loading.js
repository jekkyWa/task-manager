import React from "react";
import "./loading.css";

const Loading = ({ style = "" }) => {
  return (
    <div className={`lds-roller ${style}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
