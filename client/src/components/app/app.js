import Login from "../authentication/login";
import Register from "../authentication/register";
import { Redirect, Route, Switch } from "react-router-dom";

import "./app.css";

const App = () => {
  return (
    <Switch>
      <Route path="/signup" component={Register} />
      <Route path="/login" component={Login} />
      <Redirect to="/login" />
    </Switch>
  );
};

export default App;
