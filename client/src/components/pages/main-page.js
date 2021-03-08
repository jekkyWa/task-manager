import React, { useEffect } from "react";
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
      saveDataIdentification(data.email, data.name, data.active_rooms);
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
  getDataReducer: { active_rooms, name },
  loginReducer: { token },
}) => {
  return { token, active_rooms, name };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataIdentification: (email, name, active_rooms) => {
      dispatch(saveDataIdentification(email, name, active_rooms));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
