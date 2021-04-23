import React, { useState } from "react";
import "./menu.scss";
import { connect } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentLateOutlinedIcon from "@material-ui/icons/AssignmentLateOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MyTask from "./my-task";
import CreatedTasks from "./created-tasks";
import { displaySelection } from "../../action/action-save-date";
import RecentActivity from "./recent-activity";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import CompletedTasks from "./completed-tasks";

const Menu = ({ onHide, card, cardFull, displaySelection, activData }) => {
  const [selectState, setSelectState] = useState("Menu");
  return (
    <div className="menu">
      <div className="menu-logo">
        <div className={selectState == "Menu" ? "hidden" : ""}>
          <div>
            <ArrowBackIcon
              fontSize="small"
              onClick={() => setSelectState("Menu")}
            />
          </div>
        </div>
        <div className="menu-icon">
          <h1>{selectState}</h1>
        </div>
        <div className="menu-close">
          <div>
            <CloseIcon fontSize="small" onClick={() => onHide()} />
          </div>
        </div>
      </div>
      <div className={selectState == "Menu" ? "" : "hidden"}>
        <div
          className="menu-item"
          onClick={() => {
            setSelectState("Completed tasks");
          }}
        >
          <div>
            <DoneOutlineIcon />
          </div>
          <h1>Completed tasks</h1>
        </div>
        <div
          className="menu-item"
          onClick={() => {
            displaySelection({ valueDisp: card, stateFilter: true });
          }}
        >
          <div>
            <AssignmentLateOutlinedIcon />
          </div>
          <h1> Show only accessible tasks</h1>
        </div>
        <div
          className="menu-item"
          onClick={() => {
            displaySelection({ valueDisp: cardFull, stateFilter: false });
          }}
        >
          <div>
            <AssignmentOutlinedIcon />
          </div>
          <h1>Show all tasks</h1>
        </div>
        <div
          className="menu-item"
          onClick={() => {
            setSelectState("Created tasks");
          }}
        >
          <div>
            <AssignmentTurnedInOutlinedIcon />
          </div>
          <h1> Created tasks </h1>
        </div>
        <div
          className="menu-item"
          onClick={() => {
            setSelectState("My task");
          }}
        >
          <div>
            <AssignmentIndOutlinedIcon />
          </div>
          <h1>My tasks</h1>
        </div>
        <hr />
        <div className="menu-recent-activity">
          <div>
            <FormatListBulletedIcon />
          </div>
          <h1> Recent Actions</h1>
        </div>
        <RecentActivity />
      </div>
      <div className={selectState == "About board" ? "" : "hidden"}>
        {/* <MenuAboutBoard />{" "} */}
      </div>
      <div className={selectState == "Completed tasks" ? "" : "hidden"}>
        <CompletedTasks />
      </div>
      <div className={selectState == "My task" ? "" : "hidden"}>
        <MyTask />
      </div>
      <div className={selectState == "Created tasks" ? "" : "hidden"}>
        <CreatedTasks />
      </div>
    </div>
  );
};

const mapStateToProps = ({
  reducerSaveData: { card, cardFull, activData },
}) => {
  return {
    card,
    cardFull,
    activData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displaySelection: (valueDisplay) => {
      dispatch(displaySelection(valueDisplay));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
