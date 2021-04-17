import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Register from "../authentication/register/register-page.js";
import Login from "../authentication/login/login";
import Page from "../pages/main/main-page";
import BeginningOfWorkPage from "../pages/beginning-of-work-page";
import BoardPage from "../pages/boards-page";
import CardPage from "../pages/card-page";
import Participants from "../participants/participants";
import ImportantEvents from "../important-events/important-events";
import BoardsMainPage from "../boards-main-page/boards-main-page";

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
        <Route path="/boards" exact>
          <BoardsMainPage />
        </Route>
        <Route path="/boards/:id" exact>
          <BoardPage />
        </Route>
        <Route path="/boards/:id/participants" exact>
          <Participants />
        </Route>
        <Route path="/boards/:id/important_events" exact>
          <ImportantEvents />
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
        <Route path="/page" exact>
          <Page />
        </Route>
        <Route path="/signup" exact>
          <Register />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Redirect to="/page" />
      </Switch>
    );
  }
};

export default useRoutes;
