import React, { useState } from "react";
import { useParams } from "react-router-dom";
// files
import "./completed-tasks.scss";
// material
import CodeIcon from "@material-ui/icons/Code";
import DeveloperModeIcon from "@material-ui/icons/DeveloperMode";
import PersonalVideoIcon from "@material-ui/icons/PersonalVideo";
import BusinessIcon from "@material-ui/icons/Business";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import CompletedTasksMenuItem from "./blocks/completed-tasks-menu-item";
import CompletedTasksItem from "./blocks/completed-tasks-item";

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
        <CompletedTasksMenuItem
          value="Back-end developer"
          component={<CodeIcon />}
          findCompletedTask={findCompletedTask}
        />
        <CompletedTasksMenuItem
          value="Front-end developer"
          component={<DeveloperModeIcon />}
          findCompletedTask={findCompletedTask}
        />
        <CompletedTasksMenuItem
          value="QA"
          component={<PersonalVideoIcon />}
          findCompletedTask={findCompletedTask}
        />
        <CompletedTasksMenuItem
          value="Business Analyst"
          component={<BusinessIcon />}
          findCompletedTask={findCompletedTask}
        />
        <CompletedTasksMenuItem
          value="UX/UI designer"
          component={<ColorLensIcon />}
          findCompletedTask={findCompletedTask}
        />
        <CompletedTasksMenuItem
          value="Marketing specialist"
          component={<MonetizationOnIcon />}
          findCompletedTask={findCompletedTask}
        />
        <CompletedTasksMenuItem
          value="Product manager"
          component={<SupervisedUserCircleIcon />}
          findCompletedTask={findCompletedTask}
        />
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
        <CompletedTasksItem
          dataCompliteTask={dataCompliteTask}
          findOtherData={findOtherData}
          saveDataToModal={saveDataToModal}
          modalShow={modalShow}
          name={name}
        />
      </div>
    </div>
  );
};

export default CompletedTasks;
