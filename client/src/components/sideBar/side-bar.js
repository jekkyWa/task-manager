import React, { useState } from "react";
import { Link } from "react-router-dom";
// files
import ModalCreateProject from "../modal/modal-create-project/modal-create-project";
import "./side-bar.scss";
import SideBarItem from "./side-bar-item";
// material
import AddIcon from "@material-ui/icons/Add";
import DashboardIcon from "@material-ui/icons/Dashboard";
import TimelineIcon from "@material-ui/icons/Timeline";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";

const SideBar = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="projects">
      <nav className="main-page-left-sidebar">
        <div className="sidebar-block-one">
          <Link to="/boards" className="sidebar-block-one-item">
            <DashboardIcon className="main-icon-side-bar" fontSize="small" />
            <h1>Boards</h1>
          </Link>
          <Link to="/main_page" className="sidebar-block-one-item">
            <TimelineIcon className="main-icon-side-bar" fontSize="small" />
            <h1>Home page</h1>
          </Link>
          <Link to="/begin" className="sidebar-block-one-item">
            <CheckBoxOutlinedIcon
              className="main-icon-side-bar"
              fontSize="small"
            />
            <h1>Beginning of work</h1>
          </Link>
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
          <SideBarItem />
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
