import React, { useEffect } from "react";
import "./header.scss";
import { useHistory } from "react-router-dom";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import DashboardIcon from "@material-ui/icons/Dashboard";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import { connect } from "react-redux";

const Header = ({ email, name, logout }) => {
  const history = useHistory();

  const logoutHandler = (event) => {
    event.preventDefault();
    logout();
    history.push("/login");
  };

  return (
    <div className="header ">
      <div className="menu-header">
        <div className="header-item">
          <div>
            <HomeOutlinedIcon />
          </div>
        </div>
        <div className="header-item">
          <div>
            <DashboardIcon />
          </div>
          <div>
            <h1>Boards</h1>
          </div>
        </div>
        <div className="header-input">
          <input
            placeholder="Search and filter projects"
            className="search-input"
          />
        </div>
      </div>
      <div className="header-logo">
        <div>
          <DashboardIcon />
        </div>
        <h1>nieTask</h1>
      </div>
      <div className="item-header-email">
        <div className="notification-icon">
          <NotificationsNoneOutlinedIcon />
        </div>
        <div className="icon-profile" onClick={logoutHandler}>
          <p>{email[0].toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: { email, name },
  loginReducer: { logout },
}) => {
  return { email, name, logout };
};

export default connect(mapStateToProps, null)(Header);
