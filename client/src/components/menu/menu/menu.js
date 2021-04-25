import React, { useState } from "react";
// files
import "./menu.scss";
import MyTask from "../my-task/my-task";
import CreatedTasks from "../created-task/created-tasks";
import RecentActivity from "../recent-activity/recent-activity";
import CompletedTasks from "../competed-tasks/completed-tasks";
// redux
import { connect } from "react-redux";
import { displaySelection } from "../../../action/action-save-date";
import { modalShow } from "../../../action/action-modal";
import { saveDataToModal } from "../../../action/action-save-date";
// material
import CloseIcon from "@material-ui/icons/Close";
import AssignmentLateOutlinedIcon from "@material-ui/icons/AssignmentLateOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";

const Menu = ({
  onHide,
  card,
  cardFull,
  displaySelection,
  saveDataToModal,
  modalShow,
  email,
  activData,
}) => {
  // Switching between menu items occurs with the value of the state
  const [selectState, setSelectState] = useState("Menu");

  return (
    <div className="menu">
      <div className="menu-logo">
        <div className={selectState == "Menu" ? "hidden" : "arrow-icon-menu"}>
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
      <div className={selectState == "Menu" ? "menu-body-block" : "hidden"}>
        {/* Completed tasks */}
        <div
          className="menu-item"
          onClick={() => {
            setSelectState("Completed tasks");
          }}
        >
          <div>
            <DoneOutlineIcon fontSize="small" />
          </div>
          <h1>Completed tasks</h1>
        </div>
        {/* Tasks that are available only for user role */}
        <div
          className="menu-item"
          onClick={() => {
            displaySelection({ valueDisp: card, stateFilter: true });
          }}
        >
          <div>
            <AssignmentLateOutlinedIcon fontSize="small" />
          </div>
          <h1> Show only accessible tasks</h1>
        </div>
        {/* Show all tasks */}
        <div
          className="menu-item"
          onClick={() => {
            displaySelection({ valueDisp: cardFull, stateFilter: false });
          }}
        >
          <div>
            <AssignmentOutlinedIcon fontSize="small" />
          </div>
          <h1>Show all tasks</h1>
        </div>
        {/* Created tasks */}
        <div
          className="menu-item"
          onClick={() => {
            setSelectState("Created tasks");
          }}
        >
          <div>
            <AssignmentTurnedInOutlinedIcon fontSize="small" />
          </div>
          <h1> Created tasks </h1>
        </div>
        {/* Task taken */}
        <div
          className="menu-item"
          onClick={() => {
            setSelectState("My task");
          }}
        >
          <div>
            <AssignmentIndOutlinedIcon fontSize="small" />
          </div>
          <h1>My tasks</h1>
        </div>
        <hr />
        {/* Last Activity */}
        <div className="menu-recent-activity">
          <div>
            <FormatListBulletedIcon fontSize="small" />
          </div>
          <h1> Recent Actions</h1>
        </div>
        <RecentActivity activData={activData} />
      </div>
      {/* Displays completed tasks */}
      <div className={selectState == "Completed tasks" ? "" : "hidden"}>
        <CompletedTasks
          saveDataToModal={saveDataToModal}
          modalShow={modalShow}
          cardFull={cardFull}
        />
      </div>
      {/* Displays taken assignments */}
      <div className={selectState == "My task" ? "" : "hidden"}>
        <MyTask
          cardFull={cardFull}
          email={email}
          modalShow={modalShow}
          saveDataToModal={saveDataToModal}
        />
      </div>
      {/* Display created tasks */}
      <div
        className={
          selectState == "Created tasks" ? "created-tasks-menu" : "hidden"
        }
      >
        <CreatedTasks
          cardFull={cardFull}
          email={email}
          modalShow={modalShow}
          saveDataToModal={saveDataToModal}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({
  reducerDataIdentification: { email },
  reducerSaveData: { card, cardFull, activData },
}) => {
  return {
    card,
    cardFull,
    activData,
    email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displaySelection: (valueDisplay) => {
      dispatch(displaySelection(valueDisplay));
    },
    saveDataToModal: (dataToModal) => {
      dispatch(saveDataToModal(dataToModal));
    },
    modalShow: (show) => {
      dispatch(modalShow(show));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
