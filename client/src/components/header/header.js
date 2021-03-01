import React, { useEffect } from "react";
import "./header.scss";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useHttp } from "../hooks/http.hook";

const Header = ({ logout }) => {
  const history = useHistory();
  const logoutHandler = (event) => {
    event.preventDefault();
    logout();
    history.push("/login");
  };

  const { request } = useHttp();

  const getData = async () => {
    try {
      const data = await request("/api/getData/emailAndPassword");
      console.log(data)
    } catch (e) {}
  };

  useEffect(() => {getData()}, []);

  return (
    <div className="container-fluid header">
      <div className="row">
        <div className="col-6 back-button-block">
          <ArrowBackIcon
            className="back-button"
            fontSize="large"
            onClick={logoutHandler}
          />
        </div>
        <div className="col-6 inf-bar">
          <p>email</p>
          <p>name</p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ loginReducer: { logout } }) => {
  return { logout };
};

export default connect(mapStateToProps, null)(Header);
