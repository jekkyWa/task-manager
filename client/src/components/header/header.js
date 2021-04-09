import React from "react";
import "./header.scss";
import { Link, useHistory } from "react-router-dom";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import DashboardIcon from "@material-ui/icons/Dashboard";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";
import { connect } from "react-redux";
import NotificationsBlock from "./notifications-block";
import {
  showNotifications,
  showBoards,
  showUserBlock,
  showSearchBlock,
} from "../../action/action-login";
import BoardsBlock from "./boards";
import SearchBlock from "./search";
import UserBlock from "./user";

const Header = ({
  email,
  logout,
  color,
  notifications,
  showNotifications,
  showNotification,
  showBoard,
  showBoards,
  showUser,
  showSearch,
  showUserBlock,
  showSearchBlock,
}) => {
  const history = useHistory();

  const logoutHandler = (event) => {
    event.preventDefault();
    logout();
    history.push("/login");
  };

  return (
    <div>
      <div className={`header ${color + "-header"}`}>
        <div className="menu-header">
          <div className="header-item">
            <Link to="/page">
              <div>
                <HomeOutlinedIcon />
              </div>
            </Link>
          </div>
          <div
            className="header-item"
            onClick={() => {
              showBoards(!showBoard);
              showUserBlock(false);
              showNotifications(false);
            }}
          >
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
          <div
            className="notification-icon"
            onClick={() => {
              showNotifications(!showNotification);
              showUserBlock(false);
              showBoards(false);
            }}
          >
            <NotificationsNoneOutlinedIcon />
            <span className="number-of-natifications">
              {notifications.length}
            </span>
          </div>
          <div
            className="icon-profile"
            onClick={() => {
              showUserBlock(!showUser);
              showNotifications(false);
              showBoards(false);
            }}
          >
            <p>{email[0].toUpperCase()}</p>
          </div>
        </div>
      </div>
      <div className={showNotification ? "" : "hidden"}>
        <NotificationsBlock />
      </div>
      <div className={showBoard ? "" : "hidden"}>
        <BoardsBlock />
      </div>
      <div className={showSearch ? "" : "hidden"}>
        <SearchBlock />
      </div>
      <div className={showUser ? "" : "hidden"}>
        <UserBlock />
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: {
    email,
    name,
    notifications,
    showNotification,
    showBoard,
    showUser,
    showSearch,
  },
  loginReducer: { logout },
}) => {
  return {
    email,
    name,
    logout,
    notifications,
    showNotification,
    showBoard,
    showUser,
    showSearch,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotifications: (showNotification) => {
      dispatch(showNotifications(showNotification));
    },
    showBoards: (showBoard) => {
      dispatch(showBoards(showBoard));
    },
    showUserBlock: (showUser) => {
      dispatch(showUserBlock(showUser));
    },
    showSearchBlock: (showSearch) => {
      dispatch(showSearchBlock(showSearch));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
