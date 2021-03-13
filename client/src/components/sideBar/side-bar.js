import React, { useState, useEffect } from "react";
import AddIcon from "@material-ui/icons/Add";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DashboardIcon from "@material-ui/icons/Dashboard";
import TimelineIcon from "@material-ui/icons/Timeline";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import SettingsIcon from "@material-ui/icons/Settings";
import ModalCreateProject from "../modal";
import { connect } from "react-redux";
import "./side-bar.scss";
import { Link } from "react-router-dom";

const SideBar = ({ active_rooms, name }) => {
  const [modalShow, setModalShow] = useState(false);
  const [arrId, setArrId] = useState([]);

  const menuState = (id) => {
    if (arrId.indexOf(id) !== -1) {
      setArrId([
        ...arrId.slice(0, arrId.indexOf(id)),
        ...arrId.slice(arrId.indexOf(id) + 1),
      ]);
    } else {
      setArrId([...arrId, id]);
    }
  };

  const label = active_rooms.map((e) => {
    return (
      <React.Fragment key={e.board_id}>
        <div
          className="sidebar-block-two-item-work-place"
          onClick={() => {
            menuState(e.board_id);
          }}
        >
          <SupervisorAccountIcon className="test" />
          <h2>{`${name}: ${e.name_Project}`}</h2>
          <ExpandMoreIcon className="test" />
        </div>
        <div
          className={`retractable-block ${
            arrId.indexOf(e.board_id) == -1 ? "hidden" : ""
          }`}
        >
          <div className="retractable-block-item">
            <DashboardIcon fontSize="small" />
            <h1>
              <Link to={`/boards/${e.name_Project + e.board_id}`}>Boards</Link>
            </h1>
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
            <h1>
              <Link to="/page"> Home page</Link>
            </h1>
          </div>
          <div className="sidebar-block-one-item">
            <CheckBoxOutlinedIcon fontSize="small" />
            <h1>
              <Link to="/begin"> Beginning of work</Link>
            </h1>
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

const mapStateToProps = ({ getDataReducer: { active_rooms, name } }) => {
  return { active_rooms, name };
};

export default connect(mapStateToProps, null)(SideBar);