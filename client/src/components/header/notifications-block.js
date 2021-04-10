import React, { useEffect } from "react";
import "./notifications-block.scss";
import CloseIcon from "@material-ui/icons/Close";
import dogImage from "../../images/dog.svg";
import { connect } from "react-redux";
import {
  showNotifications,
  saveNotifications,
  saveDataIdentification,
} from "../../action/action-login";
import { useHttp } from "../hooks/http.hook";

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
        console.log(value);
        saveNotifications(value);
      });

      return () => socket.off("getAfterRefuseNotification");
    }
  }, [socket, notifications]);

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
  const label = notifications.map((e, i) => {
    // Нужен: id доски, id уведомления, сообщение, добавить запись в БД
    const refuse = async () => {
      await socket.emit("refuseOffer", {
        id_notification: e.id_notification,
        id_board: e.id_board,
        email: email,
        message: `The user ${email} refused to participate in the team`,
      });
    };
    const accept = async () => {
      socket.emit("acceptOffer", {
        id_notification: e.id_notification,
        id_board: e.id_board,
        email: email,
        message: `The user ${email} took a request to participate in the team`,
      });
    };
    if (e.type == "AddingToCommand") {
      return (
        <div
          key={i}
          className={
            i + 1 == notifications.length
              ? "notifications-item-body notifications-item-body-end"
              : "notifications-item-body"
          }
        >
          <h1>
            {i + 1}
            {") "}
            {e.title}
          </h1>
          <div className="btns-notifications-item-body">
            <button
              className="join"
              onClick={() => {
                accept();
              }}
            >
              Join
            </button>
            <button
              className="refuse"
              onClick={() => {
                refuse();
              }}
            >
              Refuse
            </button>
          </div>
        </div>
      );
    }
  });

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
        <div className="body-notifications-item">{label}</div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: { notifications, socket, email },
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
