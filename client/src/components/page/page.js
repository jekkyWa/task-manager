import React from "react";
import {useHistory} from "react-router-dom"
import {connect} from "react-redux";

const Page = ({logout}) => {
    const history = useHistory()
    const logoutHandler = event => {
        event.preventDefault();
        logout();
        history.push("/login")
    }
    return (
        <div>
            You are in the system <a href={"/login"} onClick={logoutHandler}>Exit</a>
        </div>
    );
};

const mapStateToProps = ({loginReducer: {logout}}) => {
    return {logout};
};

export default connect(mapStateToProps, null)(Page);
