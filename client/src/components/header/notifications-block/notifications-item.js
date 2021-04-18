import React from "react";
import dateFormat from "dateformat";

const NotificationItem = ({ email, notifications, socket }) => {
  const label = notifications.map((e, i) => {
    // Нужен: id доски, id уведомления, сообщение, добавить запись в БД
    const refuse = async () => {
      let now = new Date();
      await socket.emit("refuseOffer", {
        id_notification: e.id_notification,
        id_board: e.id_board,
        email: email,
        message: `The user ${email} refused to participate in the team`,
        date: dateFormat(now, "dd-mm-yyyy, hh:MM:ss "),
      });
    };
    const accept = async () => {
      let now = new Date();
      socket.emit("acceptOffer", {
        id_notification: e.id_notification,
        id_board: e.id_board,
        email: email,
        message: `The user ${email} took a request to participate in the team`,
        date: dateFormat(now, "dd-mm-yyyy, hh:MM:ss "),
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
          <h1>{e.title}</h1>
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
  return label;
};

export default NotificationItem;
