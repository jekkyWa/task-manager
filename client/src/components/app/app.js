import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useAuth } from "../hooks/auth.hook";
import {
  fetchLogin,
  saveSocket,
  saveNotifications,
  saveDataIdentification,
} from "../../action/action-login";
import "./app.css";
import useRoutes from "../routes/routes";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import io from "socket.io-client";
import { useHttp } from "../hooks/http.hook";
import Loading from "../loading/loading";

const App = ({
  fetchLogin,
  saveSocket,
  socket,
  email,
  saveNotifications,
  saveDataIdentification,
  notifications,
}) => {
  // const [loading, setLoading] = useState(true);
  const { login, logout, token, userId } = useAuth();
  const isAuthenticated = !!token;
  useEffect(() => {
    fetchLogin(token, userId, login, logout, isAuthenticated);
  }, [token, login]);
  const { request } = useHttp();

  const phone = "192.168.43.127:5000";
  const local = "http://localhost:5000";

  useEffect(async () => {
    let url = window.location.href;
    const condition = (word) => {
      return url.slice(url.length - word.length) !== word;
    };
    if (
      isAuthenticated &&
      condition("main_page") &&
      condition("signup") &&
      condition("login")
    ) {
      const data = await request("/api/getData/test", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      saveDataIdentification(data.email, data.name, data.rooms);
      // setLoading(false);
    }
  }, [isAuthenticated]);

  // готово
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
      saveSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, [isAuthenticated, email]);

  // перенести в header
  // Обновление при получение notification

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (value) => {
        if (value) {
          console.log(value);
          saveNotifications([...notifications, value[0]]);
        }
      });
      return () => socket.off("getNotification");
    }
  }, [socket, notifications]);

  const routes = useRoutes(isAuthenticated);

  // if (loading) {
  //   return (
  //     <div className="loading">
  //       <Loading />
  //     </div>
  //   );
  // }

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
    saveDataIdentification: (email, name, rooms) => {
      dispatch(saveDataIdentification(email, name, rooms));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
