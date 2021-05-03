import React, { useEffect, useState } from "react";
import { Redirect, useHistory, useParams, withRouter } from "react-router-dom";
import io from "socket.io-client";
// files
import { useAuth } from "../hooks/auth.hook";
import "./app.css";
import useRoutes from "../routes";
import { useHttp } from "../hooks/http.hook";
// redux
import { connect } from "react-redux";
import { fetchLogin } from "../../action/action-login";
import { saveDataIdentification } from "../../action/action-identfication-data";
import {
  saveSocket,
  saveNotifications,
  saveActiveBoard,
} from "../../action/action-save-date";
import Loading from "../loading/loading-main/loading";

const App = ({
  fetchLogin,
  saveSocket,
  socket,
  email,
  saveNotifications,
  saveDataIdentification,
  notifications,
  saveActiveBoard,
  boardActive,
  name,
  rooms,
}) => {
  const { id } = useParams();
  const { login, logout, token, userId, ready } = useAuth();
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!token;
  useEffect(() => {
    fetchLogin(token, userId, login, logout, isAuthenticated);
  }, [token, login]);
  const { request } = useHttp();

  // For basic test
  const local = "http://localhost:5000";

  useEffect(() => {
    if (socket) {
      socket.on("getDataAfterExit", (value) => {
        saveDataIdentification(email, name, value);
      });
      return () => socket.off("getDataAfterDeleteUser");
    }
  }, [socket, rooms]);

  useEffect(() => {
    if (socket) {
      socket.on("getDataAfterDeleteCommand", (value) => {
        console.log(value);
        if (value.emailOfCreator == email) {
          const deleteRoomIndexOfCreator = rooms.active.findIndex(
            (e) => e.board_id == value.board_id
          );
          const deleteItemOfCreator = {
            active: [
              ...rooms.active.slice(0, deleteRoomIndexOfCreator),
              ...rooms.active.slice(deleteRoomIndexOfCreator + 1),
            ],
            passive: rooms.passive,
            update: false,
          };
          saveDataIdentification(email, name, deleteItemOfCreator);
          return (window.location.href = "/begin");
        }
        const deleteRoomIndex = rooms.passive.findIndex(
          (e) => e.board_id == value.board_id
        );
        const deleteItem = {
          active: rooms.active,
          passive: [
            ...rooms.passive.slice(0, deleteRoomIndex),
            ...rooms.passive.slice(deleteRoomIndex + 1),
          ],
          update: false,
        };
        saveDataIdentification(email, name, deleteItem);
        return (window.location.href = "/begin");
      });
      return () => socket.off("getDataAfterDeleteCommand");
    }
  }, [socket, rooms]);

  useEffect(async () => {
    let url = window.location.href;
    // Check URL
    const condition = (word) => {
      return url.slice(url.length - word.length) !== word;
    };
    // Connect to sockets does not occur at these addresses
    if (
      isAuthenticated &&
      condition("main_page") &&
      condition("signup") &&
      condition("login")
    ) {
      setLoading(true);
      const data = await request("/api/getData/test", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      saveDataIdentification(data.email, data.name, data.rooms);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Update all items when deleting a user
  useEffect(() => {
    if (socket) {
      socket.on("getDataAfterDeleteUser", (value) => {
        const idCheck = id ? id.slice(id.length - 10) : "";
        if (
          value.board.addedUsers.findIndex((e) => e.email == email) == -1 &&
          email !== value.board.creator &&
          idCheck == value.board.board_id
        ) {
          saveDataIdentification(email, name, {
            active: value.active,
            passive: value.passive,
            update: true,
          });
          window.location.href = "/begin";
        } else if (
          value.board.addedUsers.findIndex((e) => e.email == email) == -1
        ) {
          saveDataIdentification(email, name, {
            active: value.active,
            passive: value.passive,
            update: true,
          });
          window.location.href = "/begin";
        } else {
          saveActiveBoard(value.board);
        }
      });
      return () => socket.off("getDataAfterDeleteUser");
    }
  }, [socket, boardActive]);

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  // Main connecting sockets
  useEffect(() => {
    if (isAuthenticated && email !== "email") {
      const newSocket = io(local, {
        query: {
          token,
        },
      });
      newSocket.on("disconnect", () => {
        saveSocket(null);
      });

      newSocket.on("connect", () => {
        newSocket.emit("setUserId", email);
        console.log("succes");
      });
      newSocket.on("reconnect", function () {
        console.log("reconnect fired!");
      });
      saveSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, [isAuthenticated, email]);

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (value) => {
        console.log(value);
        if (value) {
          console.log(value);
          saveNotifications([...notifications, value]);
        }
      });
      return () => socket.off("getNotification");
    }
  }, [socket, notifications]);

  const routes = useRoutes(isAuthenticated);

  if (loading || !ready) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  return routes;
};

const mapStateToProps = ({
  reducerDataIdentification: { email, name, rooms },
  reducerSaveData: { boardActive, socket, notifications },
}) => {
  return { boardActive, email, socket, notifications, name, rooms };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLogin: (token, userId, login, logout, isAuthenticated) => {
      dispatch(fetchLogin(token, userId, login, logout, isAuthenticated));
    },
    saveNotifications: (notifications) => {
      dispatch(saveNotifications(notifications));
    },
    saveSocket: (socket) => {
      dispatch(saveSocket(socket));
    },
    saveDataIdentification: (email, name, rooms) => {
      dispatch(saveDataIdentification(email, name, rooms));
    },
    saveActiveBoard: (boardActive) => {
      dispatch(saveActiveBoard(boardActive));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
