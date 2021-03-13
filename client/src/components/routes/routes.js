import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Register from "../authentication/register";
import Login from "../authentication/login";
import Page from "../pages/main-page";
import BeginningOfWorkPage from "../pages/beginning-of-work-page";
import BoardPage from "../pages/boards-page";
import CardPage from "../pages/card-page";

const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/page" exact>
          <Page />
        </Route>
        <Route path="/begin" exact>
          <BeginningOfWorkPage />
        </Route>
        <Route path="/boards/:id" exact>
          <BoardPage />
        </Route>
        <Route path="/boards/:id/:name" exact>
          <CardPage />
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
