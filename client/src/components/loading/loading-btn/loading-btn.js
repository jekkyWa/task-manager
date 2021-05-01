import React from "react";
import "./loading-btn.scss";

const LoadingBtn = (style) => {
  return (
    <div
      className={`loadingio-spinner-spinner-prdcmi10mz ${
        style ? " black-loading" : ""
      }`}
    >
      <div className="ldio-kg4bf1orb3r">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingBtn;
