import React from "react";
import "./user.scss";
import CloseIcon from "@material-ui/icons/Close";

const UserBlock = () => {
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
        <h1>Сменить имя</h1>
        <h1>Сменить пароль</h1>
        <h1>Удалить аккаунт</h1>
        <h1>Выйти</h1>
      </div>
    </div>
  );
};

export default UserBlock;
