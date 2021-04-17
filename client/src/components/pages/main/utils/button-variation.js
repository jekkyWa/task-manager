import React from "react";
import { Link } from "react-router-dom";

const ButtonVariation = ({ aut }) => {
  if (aut) {
    return (
      <Link to="/begin">
        <button className="btn-to-the-boards">Go to the boards</button>
      </Link>
    );
  }
  return (
    <React.Fragment>
      <div className="btns-header-main-page">
        <Link to="/login">To come in</Link>
        <Link to="/signup">
          <button className="regitster-btn-main-page">Registration</button>
        </Link>
      </div>
    </React.Fragment>
  );
};

export default ButtonVariation;
