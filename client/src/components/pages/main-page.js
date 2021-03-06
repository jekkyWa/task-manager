import React, { useState, useEffect } from "react";
import ModalCreateProject from "../modal";
import Header from "../header";
import "./pages.scss";
import { connect } from "react-redux";
import { saveDataIdentification } from "../../action/action-login";
import { useHttp } from "../hooks/http.hook";
import Loading from "../loading/loading";
import AddIcon from "@material-ui/icons/Add";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DashboardIcon from "@material-ui/icons/Dashboard";
import TimelineIcon from "@material-ui/icons/Timeline";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import SettingsIcon from "@material-ui/icons/Settings";

const NoneProj = () => {
  const [modalShow, setModalShow] = useState(false);
  return (
    <div className="none-project">
      <p>You have no projects created</p>
      <button onClick={() => setModalShow(true)}>Create a project</button>
      <ModalCreateProject show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
};

const Proj = ({ active_rooms, name }) => {
  useEffect(() => {
    console.log(active_rooms);
  }, []);

  const [modalShow, setModalShow] = useState(false);
  const [test, setTest] = useState(false);

  const label = active_rooms.map((e) => {
    return (
      <React.Fragment key={e.board_id}>
        <div
          className="sidebar-block-two-item-work-place"
          onClick={() => {
            setTest(!test);
          }}
        >
          <SupervisorAccountIcon className="test" />
          <h2>{`${name}: ${e.name_Project}`}</h2>
          <ExpandMoreIcon className="test" />
        </div>
        <div className={`retractable-block ${!test ? "hidden" : ""}`}>
          <div className="retractable-block-item">
            <CheckBoxOutlinedIcon fontSize="small" />
            <h1>Beginning of work</h1>
          </div>
          <div className="retractable-block-item">
            <DashboardIcon fontSize="small" />
            <h1>Boards</h1>
          </div>
          <div className="retractable-block-item">
            <FavoriteBorderOutlinedIcon fontSize="small" />
            <h1>Important events</h1>
          </div>
          <div className="retractable-block-item">
            <PeopleOutlineOutlinedIcon fontSize="small" />
            <h1>Participants</h1>
          </div>
          <div className="retractable-block-item">
            <SettingsIcon fontSize="small" />
            <h1>Settings</h1>
          </div>
        </div>
      </React.Fragment>
    );
  });

  return (
    <div className="projects">
      <nav className="main-page-left-sidebar">
        <div className="sidebar-block-one">
          <div className="sidebar-block-one-item">
            <DashboardIcon fontSize="small" />
            <h1>Boards</h1>
          </div>
          <div className="sidebar-block-one-item">
            <TimelineIcon fontSize="small" />
            <h1>Home page</h1>
          </div>
        </div>
        <div className="sidebar-block-two">
          <div className="sidebar-block-two-item-comand">
            <div>
              <h2>Commands</h2>
            </div>
            <div>
              <AddIcon
                fontSize="small"
                className="add-icon"
                onClick={() => setModalShow(true)}
              />
              <ModalCreateProject
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </div>
          </div>
          {label}
        </div>
      </nav>
    </div>
  );
};

const Page = ({ token, active_rooms, saveDataIdentification, name }) => {
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

  const label =
    active_rooms.length > 0 ? (
      <Proj active_rooms={active_rooms} name={name} />
    ) : (
      <NoneProj />
    );

  return (
    <div className="main-page">
      <Header />
      <div className="container">{label}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Page);
