import React from "react";
import {
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Register from "../authentication/register";
import Login from "../authentication/login";
import Page from "../page/page";

const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/page" exact>
          <Page />
        </Route>
        <Redirect to="/page" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/signup" exact>
          <Register />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }
};

export default useRoutes;
