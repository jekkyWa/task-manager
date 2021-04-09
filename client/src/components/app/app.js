import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useAuth } from "../hooks/auth.hook";
import { fetchLogin, saveSocket } from "../../action/action-login";
import "./app.css";
import useRoutes from "../routes/routes";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import io from "socket.io-client";

const App = ({ fetchLogin, saveSocket, socket, email }) => {
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

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (value) => {
        console.log(value);
      });
      return () => socket.off("getNotification");
    }
  }, [socket]);

  const routes = useRoutes(isAuthenticated);

  return routes;
};

const mapStateToProps = ({
  getDataReducer: { boardActive, email, socket },
}) => {
  return { boardActive, email, socket };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLogin: (token, userId, login, logout, isAuthenticated) => {
      dispatch(fetchLogin(token, userId, login, logout, isAuthenticated));
    },
    saveSocket: (socket) => {
      dispatch(saveSocket(socket));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
