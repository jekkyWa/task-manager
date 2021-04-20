import React, { useEffect } from "react";
import { Link } from "react-router-dom";
//files
import "./header.scss";
import NotificationsBlock from "../notifications-block/notifications-block";
import SearchBlock from "../search";
import UserBlock from "../user-block/user";
//redux
import { connect } from "react-redux";
import { saveNotifications } from "../../../action/action-save-date";
import {
  showNotifications,
  showUserBlock,
  showSearchBlock,
} from "../../../action/action-show";
//material
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import DashboardIcon from "@material-ui/icons/Dashboard";
import NotificationsNoneOutlinedIcon from "@material-ui/icons/NotificationsNoneOutlined";

const Header = ({
  email,
  color,
  notifications,
  showNotifications,
  showNotification,
  showUser,
  showSearch,
  showUserBlock,
  socket,
  saveNotifications,
}) => {
  // Connecting to a room with notifications
  useEffect(() => {
    if (socket && email !== "email") {
      socket.emit("joinNotification", { email: email });
    }
  }, [email, socket]);

  //  Getting all notifications
  useEffect(() => {
    if (socket) {
      socket.on("getNotifications", (value) => {
        if (value) {
          saveNotifications(value);
        }
      });

      return () => socket.off("getNotifications");
    }
  }, [socket, notifications]);

  // Function for closing all windows other than active
  const stateWindow = (user, notification) => {
    showUserBlock(user);
    showNotifications(notification);
  };

  return (
    <div>
      <div className={`header ${color + "-header"}`}>
        <div className="menu-header">
          <div className="header-item">
            <Link to="/main_page">
              <div>
                <HomeOutlinedIcon className="home-icon-header" />
              </div>
            </Link>
          </div>
          <div className="header-item">
            <div>
              <DashboardIcon
                fontSize="small"
                className="dashboard-icon-header"
              />
            </div>
            <h2>
              <Link to="/boards">Boards page</Link>
            </h2>
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
          <h1>Taskood</h1>
        </div>
        <div className="item-header-email">
          <div
            className="notification-icon"
            onClick={() => {
              // Closing all unnecessary windows 1 - user, 2 - notification
              stateWindow(false, !showNotification);
            }}
          >
            <NotificationsNoneOutlinedIcon />
            {/* If there are no notifications, nothing is shown */}
            <span
              className={
                notifications.length == 0 ? "hidden" : "number-of-natifications"
              }
            >
              {notifications.length}
            </span>
          </div>
          <div
            className="icon-profile"
            onClick={() => {
              // Closing all unnecessary windows 1 - user, 2 - notification
              stateWindow(!showUser, false);
            }}
          >
            <p>{email[0].toUpperCase()}</p>
          </div>
        </div>
      </div>
      <div className={showNotification ? "" : "hidden"}>
        <NotificationsBlock />
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
  reducerSaveData: { notifications, socket },
  reducerDataIdentification: { email, name },
  showReducer: { showNotification, showUser, showSearch },
  loginReducer: { logout },
}) => {
  return {
    email,
    name,
    logout,
    notifications,
    showNotification,
    showUser,
    showSearch,
    socket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotifications: (showNotification) => {
      dispatch(showNotifications(showNotification));
    },
    showUserBlock: (showUser) => {
      dispatch(showUserBlock(showUser));
    },
    showSearchBlock: (showSearch) => {
      dispatch(showSearchBlock(showSearch));
    },
    saveNotifications: (notifications) => {
      dispatch(saveNotifications(notifications));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
