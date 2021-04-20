import React, { useState } from "react";
import { Link } from "react-router-dom";
// files
import ModalCreateProject from "../modal-create-project";
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
          <div className="sidebar-block-one-item">
            <DashboardIcon className="main-icon-side-bar" fontSize="small" />
            <h1>
              <Link to="/boards"> Boards</Link>
            </h1>
          </div>
          <div className="sidebar-block-one-item">
            <TimelineIcon className="main-icon-side-bar" fontSize="small" />
            <h1>
              <Link to="/main_page"> Home page</Link>
            </h1>
          </div>
          <div className="sidebar-block-one-item">
            <CheckBoxOutlinedIcon
              className="main-icon-side-bar"
              fontSize="small"
            />
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
          <SideBarItem />
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
