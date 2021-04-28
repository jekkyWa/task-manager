import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
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
import { saveSocket, saveNotifications } from "../../action/action-save-date";
import Loading from "../loading/loading-main/loading";

const App = ({
  fetchLogin,
  saveSocket,
  socket,
  email,
  saveNotifications,
  saveDataIdentification,
  notifications,
}) => {
  const { login, logout, token, userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!token;
  useEffect(() => {
    fetchLogin(token, userId, login, logout, isAuthenticated);
  }, [token, login]);
  const { request } = useHttp();

  // For dough on phone
  const phone = "192.168.43.127:5000";
  // For basic test
  const local = "http://localhost:5000";

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
      saveSocket(newSocket);
      return () => newSocket.disconnect();
    }
  }, [isAuthenticated, email]);

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

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  return routes;
};

const mapStateToProps = ({
  reducerDataIdentification: { email },
  reducerSaveData: { boardActive, socket, notifications },
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
