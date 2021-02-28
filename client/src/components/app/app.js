import React, {useEffect} from "react";
import {connect} from "react-redux";
import {useAuth} from "../hooks/auth.hook";
import {fetchLogin} from "../../action/action-login";
import "./app.css";
import useRoutes from "../routes/routes";
import {BrowserRouter as Router} from "react-router-dom";


const App = ({fetchLogin}) => {
    const {login, logout, token, userId} = useAuth();
    const isAuthenticated = !!token;
    useEffect(() => {
        fetchLogin(token, userId, login, logout, isAuthenticated);
    }, [token, login]);
    const routes = useRoutes(isAuthenticated);
    return (<Router>{routes}</Router>);
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchLogin: (token, userId, login, logout, isAuthenticated) => {
            dispatch(fetchLogin(token, userId, login, logout, isAuthenticated));
        },
    };
};

export default connect(null, mapDispatchToProps)(App);
