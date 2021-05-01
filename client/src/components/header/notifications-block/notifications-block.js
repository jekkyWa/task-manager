import React, { useEffect } from "react";
// files
import "./notifications-block.scss";
import dogImage from "../../../images/dog.svg";
// redux
import { saveNotifications } from "../../../action/action-save-date";
import { saveDataIdentification } from "../../../action/action-identfication-data";
import { showNotifications } from "../../../action/action-show";
import { connect } from "react-redux";
// material
import CloseIcon from "@material-ui/icons/Close";
import NotificationItem from "./notifications-item";

const NotificationsBlock = ({
  notifications,
  showNotifications,
  socket,
  email,
  saveNotifications,
  saveDataIdentification,
}) => {
  useEffect(() => {
    if (socket) {
      socket.on("getAfterRefuseNotification", (value) => {
        saveNotifications(value);
      });

      return () => socket.off("getAfterRefuseNotification");
    }
  }, [socket, notifications]);

  useEffect(() => {
    if (socket) {
      socket.on("getAfterReadedNotification", (value) => {
        saveNotifications(value);
      });
    }
  });

  useEffect(() => {
    if (socket) {
      socket.on("getAfterAcceptNotification", (value) => {
        saveNotifications(value.user.notifications);
        console.log(value);
        saveDataIdentification(value.user.email, value.user.name, value.rooms);
      });

      return () => socket.off("getAfterAcceptNotification");
    }
  }, [socket, notifications]);

  return (
    <div className="notifications-block">
      <div className="header-notifications">
        <p>Notifications</p>
        <div className="close-notifications">
          <CloseIcon
            fontSize="small"
            onClick={() => {
              showNotifications(false);
            }}
          />
        </div>
      </div>
      <div
        className={
          notifications.length == 0 ? "body-notifications-empty" : "hidden"
        }
      >
        <div className="img-body-notifications">
          <img src={dogImage} />
          <h1>No notifications</h1>
        </div>
      </div>
      <div
        className={notifications.length !== 0 ? "body-notifications" : "hidden"}
      >
        <div className="body-notifications-item">
          <NotificationItem
            email={email}
            notifications={notifications}
            socket={socket}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  reducerDataIdentification: { email },
  reducerSaveData: { notifications, socket },
  loginReducer: { token },
}) => {
  return { notifications, socket, email, token };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotifications: (showNotification) => {
      dispatch(showNotifications(showNotification));
    },
    saveNotifications: (notifications) => {
      dispatch(saveNotifications(notifications));
    },
    saveDataIdentification: (email, name, rooms) => {
      dispatch(saveDataIdentification(email, name, rooms));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsBlock);
