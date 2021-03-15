import React, { useEffect, useState } from "react";
import SideBar from "../sideBar/side-bar";
import Header from "../header";
import "./pages.scss";
import { connect } from "react-redux";
import { saveDataIdentification } from "../../action/action-login";
import { useHttp } from "../hooks/http.hook";
import Loading from "../loading/loading";

const MainPage = ({ token, saveDataIdentification }) => {
  const { request, loading } = useHttp();
  const getData = async () => {
    try {
      const data = await request("/api/getData/test", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      saveDataIdentification(data.email, data.name, data.rooms);
    } catch (e) {}
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="main-page">
      <Header />
      <div className="container">
        <SideBar />
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: { name },
  loginReducer: { token },
}) => {
  return { token, name };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataIdentification: (email, name, rooms) => {
      dispatch(saveDataIdentification(email, name, rooms));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
