import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useAuth } from "../hooks/auth.hook";
import { fetchLogin } from "../../action/action-login";
import { BrowserRouter as Router } from "react-router-dom";
import "./app.css";
import useRoutes from "../routes/routes";

const App = ({ fetchLogin }) => {
  const { login, logout, token, userId } = useAuth();
  const isAuthenticated = !!token;
  useEffect(() => {
    fetchLogin(token, userId, login, logout, isAuthenticated);
  }, [token, login]);
  const routes = useRoutes(isAuthenticated);
  return (
    <Router>
      <div>{routes}</div>
    </Router>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLogin: (token, userId, login, logout, isAuthenticated) => {
      dispatch(fetchLogin(token, userId, login, logout, isAuthenticated));
    },
  };
};

export default connect(null, mapDispatchToProps)(App);
