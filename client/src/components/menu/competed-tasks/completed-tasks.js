import React, { useState } from "react";
import { connect } from "react-redux";
import { modalShow } from "../../../action/action-modal";
import { saveDataToModal } from "../../../action/action-save-date";
import { useParams } from "react-router-dom";
import "./completed-tasks.scss";
import CodeIcon from "@material-ui/icons/Code";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import PersonalVideoIcon from "@material-ui/icons/PersonalVideo";
import BusinessIcon from "@material-ui/icons/Business";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";

const CompletedTasks = ({ cardFull, modalShow, saveDataToModal }) => {
  let { name } = useParams();

  const [roleForComplite, setRoleForComplite] = useState("Select");
  const [dataCompliteTask, setDataCompliteTask] = useState([]);

  const findCompletedTask = (role) => {
    setRoleForComplite(role);
    const item = cardFull.cards.map((e) => (e = e.card_body)).flat();
    const filterItem = item.filter((e) => {
      return (
        e.role.findIndex((element) => element.role == role) !== -1 && e.state
      );
    });
    setDataCompliteTask(filterItem);
  };

  const findOtherData = (id) => {
    const findItem = cardFull.cards.filter(
      (e) => e.card_body.findIndex((element) => element.id_task == id) !== -1
    );
    return findItem;
  };

  return (
    <div className="completed-tasks">
      <ul
        className={
          roleForComplite == "Select" ? "completed-tasks-list" : "hidden"
        }
      >
        <h1>Choose a role that you want to see the tasks</h1>
        <li
          onClick={() => {
            findCompletedTask("Back-end developer");
          }}
        >
          <div>
            <CodeIcon />
          </div>
          <h1>Back-end developer</h1>
        </li>
        <li
          onClick={() => {
            findCompletedTask("Front-end developer");
          }}
        >
          <div>
            <DeveloperModeIcon />
          </div>
          <h1>Front-end developer</h1>
        </li>
        <li
          onClick={() => {
            findCompletedTask("QA");
          }}
        >
          <div>
            <PersonalVideoIcon />
          </div>
          <h1>QA</h1>
        </li>
        <li
          onClick={() => {
            findCompletedTask("Business Analyst");
          }}
        >
          <div>
            <BusinessIcon />
          </div>
          <h1>Business Analyst</h1>
        </li>
        <li
          onClick={() => {
            findCompletedTask("UX/UI designer");
          }}
        >
          <div>
            <ColorLensIcon />
          </div>
          <h1>UX/UI designer</h1>
        </li>
        <li
          onClick={() => {
            findCompletedTask("Marketing specialist");
          }}
        >
          <div>
            <MonetizationOnIcon />
          </div>
          <h1>Marketing specialist</h1>
        </li>
        <li
          onClick={() => {
            findCompletedTask("Product manager");
          }}
        >
          <div>
            <SupervisedUserCircleIcon />
          </div>
          <h1>Product manager</h1>
        </li>
      </ul>
      <div className={roleForComplite !== "Select" ? "" : "hidden"}>
        <p
          className="to-return"
          onClick={() => {
            setRoleForComplite("Select");
          }}
        >
          Return to the choice of roles
        </p>
        <h1 className="role-active">{roleForComplite}</h1>
        {dataCompliteTask.map((e, i) => {
          return (
            <div
              key={i}
              onClick={() => {
                findOtherData(e.id_task);
                saveDataToModal({
                  name: e.title,
                  column: findOtherData(e.id_task)[0].card_name,
                  id: e.id_task,
                  card_id: findOtherData(e.id_task)[0].card_item_id,
                  board_id: name,
                  name_add: e.name_add,
                });
                modalShow(true);
                console.log(e);
              }}
              className="task-item-complite"
            >
              <p className="task-item-complite-title">{e.title}</p>
              <p className="task-item-complite-performed">
                Performed: {e.nameOfTaker}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = ({ reducerSaveData: { cardFull } }) => {
  return {
    cardFull,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataToModal: (dataToModal) => {
      dispatch(saveDataToModal(dataToModal));
    },
    modalShow: (show) => {
      dispatch(modalShow(show));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompletedTasks);
