import React from "react";
import { connect } from "react-redux";

const CardOfTaker = ({
  dataToModal,
  email,
  socket,
  roleProfileInBoard,
  cardFull,
}) => {
  const addNameOfTaker = () => {
    socket.emit("addUserToDo", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: email,
    });
  };

  const name = cardFull.cards
    .filter((e) => e.card_item_id == dataToModal.card_id)[0]
    .card_body.filter((e) => dataToModal.id == e.id_task)[0];

  const statusProfile = (status) => {
    return status == "Senior" ? 3 : status == "Middle" ? 2 : 1;
  };
  if (name.nameOfTaker == email) {
    return <div>Вы взяли задание, для отменты нажмите кнопку</div>;
  } else if (name.nameOfTaker.length > 0) {
    return <div>Задание взял {name.nameOfTaker}</div>;
  } else if (
    !(
      name.role.findIndex((e) => e.role !== roleProfileInBoard.role) == -1 &&
      name.role.findIndex(
        (e) => statusProfile(e.level) <= statusProfile(roleProfileInBoard.level)
      ) !== -1
    ) ||
    roleProfileInBoard.role == "Product manager"
  ) {
    return <div>Вы не можете взять это задание</div>;
  } else {
    return (
      <div className="take-task-btn">
        <button onClick={addNameOfTaker}>Взять задание</button>
      </div>
    );
  }
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { roleProfileInBoard, cardFull },
}) => {
  return { token, roleProfileInBoard, cardFull };
};

export default connect(mapStateToProps, null)(CardOfTaker);
