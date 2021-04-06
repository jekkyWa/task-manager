import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useAuth } from "../hooks/auth.hook";
import {
  fetchLogin,
  saveActiveBoard,
  saveSocket,
} from "../../action/action-login";
import "./app.css";
import useRoutes from "../routes/routes";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import io from "socket.io-client";

const App = ({
  fetchLogin,
  saveSocket,
  socket,
  saveActiveBoard,
  checkDeleteUser,
  email,
  boardActive,
}) => {
  const { login, logout, token, userId } = useAuth();
  const isAuthenticated = !!token;
  useEffect(() => {
    fetchLogin(token, userId, login, logout, isAuthenticated);
  }, [token, login]);

  const phone = "192.168.43.127:5000";
  const local = "http://localhost:5000";
  const setupSocket = () => {
    const newSocket = io(local, {
      query: {
        token,
      },
    });
    console.log(newSocket);
    newSocket.on("disconnect", () => {
      saveSocket(null);
      setTimeout(setupSocket, 3000);
      console.log("disconnecnt");
    });

    newSocket.on("connect", () => {
      console.log("succes");
    });

    saveSocket(newSocket);
  };

  useEffect(() => {
    setupSocket();
  }, []);

  const routes = useRoutes(isAuthenticated);

  return routes;
};

const mapStateToProps = ({
  getDataReducer: { socket, email, boardActive },
}) => {
  return { socket, email, boardActive };
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
