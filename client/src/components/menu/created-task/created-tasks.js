import React from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { modalShow } from "../../../action/action-modal";
import { saveDataToModal } from "../../../action/action-save-date";
import "./created-tasks.scss"

const CreatedTasks = ({ cardFull, email, modalShow, saveDataToModal }) => {
  let { name } = useParams();

  const filterItem = cardFull.cards
    .map((e) => (e = e.card_body))
    .flat()
    .filter((e) => e.name_add == email);

  const findOtherData = (id) => {
    const findItem = cardFull.cards.filter(
      (e) => e.card_body.findIndex((element) => element.id_task == id) !== -1
    );
    return findItem;
  };

  const label = filterItem.map((e, i) => {
    const arrRole = e.role.map((element, index) => {
      return <span key={index}>{element.role + " " + element.level}</span>;
    });
    return (
      <div
        className="task-item-created-menu"
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
      >
        <h2 className="my-task-item-title">{e.title}</h2>
        <p className="my-task-item-name-add">Role: {arrRole}</p>
      </div>
    );
  });

  if (label.length == 0) {
    return (
      <div className="my-task">
        <h1>You have not created a single task</h1>
      </div>
    );
  }

  return (
    <div className="my-task">
      <h1>Created tasks on this board</h1>
      {label}
    </div>
  );
};

const mapStateToProps = ({
  reducerDataIdentification: { email },
  reducerSaveData: { card, cardFull, socket, roleProfileInBoard },
  loginReducer: { token },
}) => {
  return { token, card, cardFull, socket, roleProfileInBoard, email };
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

export default connect(mapStateToProps, mapDispatchToProps)(CreatedTasks);
