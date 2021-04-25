import React from "react";
import { useParams } from "react-router-dom";
// files
import "./my-task.scss";

const MyTask = ({ cardFull, email, modalShow, saveDataToModal }) => {
  let { name } = useParams();

  // Data filter required for display
  const filterItem = cardFull.cards
    .map((e) => (e = e.card_body))
    .flat()
    .filter((e) => e.nameOfTaker == email);

  // Search for data required for saving
  const findOtherData = (id) => {
    const findItem = cardFull.cards.filter(
      (e) => e.card_body.findIndex((element) => element.id_task == id) !== -1
    );
    return findItem;
  };

  const label = filterItem.map((e, i) => {
    return (
      <div
        className="task-item-my-task"
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
        <p className="my-task-item-name-add">
          Creator: <span>{e.name_add}</span>
        </p>
      </div>
    );
  });
  if (label.length == 0) {
    return (
      <div className="my-task">
        <h1>You have not yet taken any tasks</h1>
      </div>
    );
  }

  return (
    <div className="my-task">
      <h1>Top assignments in this board</h1>
      {label}
    </div>
  );
};

export default MyTask;
