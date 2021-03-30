import React, { useState } from "react";
import { connect } from "react-redux";
import { modalShow, saveDataToModal } from "../../action/action-login";
import { useParams } from "react-router-dom";

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
        <li
          onClick={() => {
            findCompletedTask("Back-end developer");
          }}
        >
          Back-end developer
        </li>
        <li
          onClick={() => {
            findCompletedTask("Front-end developer");
          }}
        >
          Front-end developer
        </li>
        <li
          onClick={() => {
            findCompletedTask("QA");
          }}
        >
          QA
        </li>
        <li
          onClick={() => {
            findCompletedTask("Business Analyst");
          }}
        >
          Business Analyst
        </li>
        <li
          onClick={() => {
            findCompletedTask("UX/UI designer");
          }}
        >
          UX/UI designer
        </li>
        <li
          onClick={() => {
            findCompletedTask("Marketing specialist");
          }}
        >
          Marketing specialist
        </li>
        <li
          onClick={() => {
            findCompletedTask("Product manager");
          }}
        >
          Product manager
        </li>
      </ul>
      <div className={roleForComplite !== "Select" ? "" : "hidden"}>
        <p
        className="to-return"
          onClick={() => {
            setRoleForComplite("Select");
          }}
        >
          Вернуться к выбору ролей
        </p>
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
              }}
              className="task-item"
            >
              <p className="my-task-item-title">{e.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = ({ getDataReducer: { cardFull } }) => {
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
