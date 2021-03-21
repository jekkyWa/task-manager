import React from "react";
import { connect } from "react-redux";

const CardOfTaker = ({ dataToModal, email, socket, card }) => {
  const addNameOfTaker = () => {
    socket.emit("addUserToDo", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: email,
    });
  };

  const name = card.cards
    .filter((e) => e.card_item_id == dataToModal.card_id)[0]
    .card_body.filter((e) => dataToModal.id == e.id_task)[0];

  if (name.nameOfTaker == email) {
    return <div>Вы взяли задание, для отменты нажмите кнопку</div>;
  } else if (name.nameOfTaker.length > 0) {
    return <div>Задание взял {name.nameOfTaker}</div>;
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
  getDataReducer: { card },
}) => {
  return { token, card };
};

export default connect(mapStateToProps, null)(CardOfTaker);
