import React from "react";
import "./user.scss";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";

const UserBlock = ({ logout }) => {
  const history = useHistory();

  const logoutHandler = (event) => {
    event.preventDefault();
    logout();
    history.push("/login");
  };
  return (
    <div className="user-block">
      <div className="header-user-block">
        <p>Account</p>
        <div className="close-notifications">
          <CloseIcon fontSize="small" />
        </div>
      </div>
      <div className="user-profile-block">
        <div className="user-profile-block-icon">
          <h1>1</h1>
        </div>
        <div className="user-profile-block-info">
          <h1>1@mail.ru</h1>
          <h1>1</h1>
        </div>
      </div>
      <div className="menu-user-block">
        <h1>Сменить пароль</h1>
        <h1>Удалить аккаунт</h1>
        <h1 onClick={logoutHandler}>Выйти</h1>
      </div>
    </div>
  );
};

const mapStateToProps = ({ loginReducer: { logout } }) => {
  return {
    logout,
  };
};

export default connect(mapStateToProps, null)(UserBlock);
