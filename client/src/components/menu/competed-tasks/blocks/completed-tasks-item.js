import React from "react";
// files
import "../completed-tasks.scss"

const CompletedTasksItem = ({
  dataCompliteTask,
  findOtherData,
  saveDataToModal,
  modalShow,
  name,
}) => {
  const label = dataCompliteTask.map((e, i) => {
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
        className="task-item-complite"
      >
        <p className="task-item-complite-title">{e.title}</p>
        <p className="task-item-complite-performed">
          Performed: {e.nameOfTaker}
        </p>
      </div>
    );
  });
  if (label.length !== 0) {
    return label;
  }
  return <h1 className="none-complited-task">Your team did not fulfill any task of this role.</h1>
};

export default CompletedTasksItem;
