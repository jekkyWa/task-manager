import React, { useState } from "react";
import "./menu.scss";
import { connect } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import PhotoSizeSelectActualOutlinedIcon from "@material-ui/icons/PhotoSizeSelectActualOutlined";
import AssignmentLateOutlinedIcon from "@material-ui/icons/AssignmentLateOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import AssignmentIndOutlinedIcon from "@material-ui/icons/AssignmentIndOutlined";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MyTask from "./my-task";
import CreatedTasks from "./created-tasks";
import { displaySelection } from "../../action/action-login";

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
            setSelectState("About board");
          }}
        >
          <div>
            <InfoOutlinedIcon />
          </div>
          <h1>О доске</h1>
        </div>
        <div
          className="menu-item"
          onClick={() => {
            console.log(activData);
          }}
        >
          <div>
            <PhotoSizeSelectActualOutlinedIcon />
          </div>
          <h1> Сменить фон</h1>
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
          <h1> Показать только доступные задания(Готово)</h1>
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
          <h1> Показать все задания(Готово)</h1>
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
          <h1> Созданные задания (Готово)</h1>
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
          <h1>Мои задания (Готово)</h1>
        </div>
        <hr />
        <div className="menu-recent-activity">
          <div>
            <FormatListBulletedIcon />
          </div>
          <h1> Последние действия</h1>
        </div>
        <p>
          {activData.map((e, i) => {
            return (
              <div
                onClick={() => {
                  console.log(e);
                }}
                key={i}
                className="activity-item"
              >
                <div className="icon-profile-recent-activity">
                  <p> {e.email[0]}</p>
                </div>
                <div className="сommentators-info">
                  <p>
                    {e.message} in card "{e.cardName}" to the "{e.taskName}"
                  </p>
                </div>
              </div>
            );
          })}
        </p>
      </div>
      <div className={selectState == "About board" ? "" : "hidden"}>
        {/* <MenuAboutBoard />{" "} */}
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

const mapStateToProps = ({ getDataReducer: { card, cardFull, activData } }) => {
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
