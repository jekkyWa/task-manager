import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useAuth } from "../hooks/auth.hook";
import {
  fetchLogin,
  saveSocket,
  saveNotifications,
} from "../../action/action-login";
import "./app.css";
import useRoutes from "../routes/routes";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import io from "socket.io-client";

const App = ({
  fetchLogin,
  saveSocket,
  socket,
  email,
  saveNotifications,
  notifications,
}) => {
  const { login, logout, token, userId } = useAuth();
  const isAuthenticated = !!token;
  useEffect(() => {
    fetchLogin(token, userId, login, logout, isAuthenticated);
  }, [token, login]);

  const phone = "192.168.43.127:5000";
  const local = "http://localhost:5000";
  const setupSocket = () => {
    if (email !== "email") {
      const newSocket = io(local, {
        query: {
          token,
        },
      });

      newSocket.on("disconnect", () => {
        saveSocket(null);
        setTimeout(setupSocket, 3000);
      });

      newSocket.on("connect", () => {
        newSocket.emit("setUserId", email);
        console.log("succes");
      });
      saveSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
  }, [email, isAuthenticated]);

  // перенести в header
  // Обновление при получение notification

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (value) => {
        if (value) {
          console.log(value);
          saveNotifications([...notifications,value[0]]);
        }
      });
      return () => socket.off("getNotification");
    }
  }, [socket, notifications]);

  const routes = useRoutes(isAuthenticated);

  return routes;
};

const mapStateToProps = ({
  getDataReducer: { boardActive, email, socket, notifications },
}) => {
  return { boardActive, email, socket, notifications };
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
