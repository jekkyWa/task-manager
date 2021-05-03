import React, { useState } from "react";
import { Link } from "react-router-dom";
// files
import { menuState } from "../utils/arr-visiable.util";
// redux
import { connect } from "react-redux";
// material
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import DashboardIcon from "@material-ui/icons/Dashboard";

const SideBarItem = ({ rooms, email, socket }) => {
  const [arrId, setArrId] = useState([]);
  //Compound of active and passive rooms
  const commonLabel = rooms.active.concat(rooms.passive);
  const label = commonLabel.map((e, i) => {
    const exit = () => {
      socket.emit("exitCommand", { board_id: e.board_id, email });
    };
    return (
      <React.Fragment key={i}>
        <div
          className="sidebar-block-two-item-work-place"
          onClick={() => {
            menuState(e.board_id, arrId, setArrId);
          }}
        >
          <div className="proj-icon">
            <SupervisorAccountIcon
              className={` ${email == e.creator ? "my-command" : ""}`}
            />
          </div>
          <h2>
            <span>{e.creator}</span>: {e.name_Project}
          </h2>
          <div className="proj-icon">
            <ExpandMoreIcon
              className={arrId.indexOf(e.board_id) !== -1 ? "hidden" : ""}
            />
            <KeyboardArrowUpIcon
              className={arrId.indexOf(e.board_id) == -1 ? "hidden" : ""}
            />
          </div>
        </div>
        <div
          className={`retractable-block ${
            arrId.indexOf(e.board_id) == -1 ? "hidden" : ""
          }`}
        >
          <div className="retractable-block-item">
            <DashboardIcon className="main-icon-side-bar" fontSize="small" />
            <h1>
              <Link to={`/boards/${e.name_Project + e.board_id}`}>Boards</Link>
            </h1>
          </div>
          <div className="retractable-block-item">
            <FavoriteBorderOutlinedIcon
              className="main-icon-side-bar"
              fontSize="small"
            />
            <h1>
              <Link
                to={`/boards/${e.name_Project + e.board_id}/important_events`}
              >
                Important events
              </Link>
            </h1>
          </div>
          <div className="retractable-block-item">
            <PeopleOutlineOutlinedIcon
              className="main-icon-side-bar"
              fontSize="small"
            />
            <h1>
              <Link to={`/boards/${e.name_Project + e.board_id}/participants`}>
                Participants
              </Link>
            </h1>
          </div>
          <div className="retractable-block-item">
            <DeleteOutlineOutlinedIcon
              className="main-icon-side-bar"
              fontSize="small"
            />
            <h1
              className={email == e.creator ? "" : "hidden"}
              onClick={() => {
                socket.emit("deleteCommand", { board_id: e.board_id });
              }}
            >
              Delete
            </h1>
            <h1 onClick={exit} className={email !== e.creator ? "" : "hidden"}>
              Exit
            </h1>
          </div>
        </div>
      </React.Fragment>
    );
  });
  return label;
};

const mapStateToProps = ({
  reducerDataIdentification: { rooms, email },
  reducerSaveData: { socket },
}) => {
  return { rooms, email, socket };
};

export default connect(mapStateToProps, null)(SideBarItem);
