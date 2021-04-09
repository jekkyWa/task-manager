import React from "react";
import "./notifications-block.scss";
import CloseIcon from "@material-ui/icons/Close";
import dogImage from "../../images/dog.svg";
import { connect } from "react-redux";
import { showNotifications } from "../../action/action-login";

const NotificationsBlock = ({ notifications, showNotifications }) => {
  const label = notifications.map((e, i) => {
    if (e.type == "AddingToCommand") {
      return (
        <div
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
            <button className="join">Join</button>
            <button className="refuse">Refuse</button>
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

const mapStateToProps = ({ getDataReducer: { notifications } }) => {
  return { notifications };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showNotifications: (showNotification) => {
      dispatch(showNotifications(showNotification));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsBlock);
