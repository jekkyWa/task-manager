import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Register from "../authentication/register/register-page.js";
import Login from "../authentication/login/login-page";
import Page from "../pages/main/main-page";
import BeginningOfWorkPage from "../pages/begin/beginning-of-work-page";
import BoardPage from "../pages/board-in-command/boards-in-command";
import CardPage from "../pages/card-page/card-page";
import Participants from "../pages/participants/participants";
import ImportantEvents from "../pages/important-events/important-events";
import BoardsMainPage from "../pages/boards/boards-main-page";

const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/main_page" exact>
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
        <Redirect to="/begin" exact />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route path="/main_page" exact>
          <Page />
        </Route>
        <Route path="/signup" exact>
          <Register />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
      </Switch>
    );
  }
};

export default useRoutes;
