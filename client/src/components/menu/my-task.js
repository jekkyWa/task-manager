import React from "react";
import { connect } from "react-redux";

const MyTask = ({ card }) => {
  const filterItem = card.cards.map((e) => (e = e.card_body));

  return (
    <div>
      <button
        onClick={() => {
          console.log(filterItem);
        }}
      >
        123
      </button>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: { card, socket, roleProfileInBoard, email },
  loginReducer: { token },
}) => {
  return { token, card, socket, roleProfileInBoard, email };
};

export default connect(mapStateToProps, null)(MyTask);
