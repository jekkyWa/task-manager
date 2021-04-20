import React, { useEffect } from "react";
import { connect } from "react-redux";
import dateFormat from "dateformat";
import { recentActivity } from "../../action/action-save-date";

const CardOfTaker = ({
  dataToModal,
  email,
  socket,
  roleProfileInBoard,
  cardFull,
  recentActivity,
  activData,
}) => {
  const item = cardFull.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];
  const name = item.card_body.filter((e) => dataToModal.id == e.id_task)[0];

  // Scroll to the user for the user and data transfer for activity

  const addNameOfTaker = () => {
    let now = new Date();
    socket.emit("addUserToDo", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: email,
      dataActiv: {
        message: `User ${email} took the task "${name.title}" on the desk  "${item.card_name}" `,
        email,
        date: dateFormat(now, "dd-mm-yyyy, hh:MM:ss "),
      },
    });
  };

  // Task is ready
  const completedTask = (boolState) => {
    socket.emit("completedTask", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      complet: boolState,
    });
  };

  // Reset task
  const refuseAssignment = () => {
    socket.emit("refuseAssignment", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
    });
  };

  // Last Activity: Took the task
  useEffect(() => {
    if (socket) {
      socket.on("taskTake", (value) => {
        console.log(value);
        recentActivity(value);
      });
      return () => socket.off("taskTake");
    }
  }, [socket, activData]);

  const statusProfile = (status) => {
    return status == "Senior" ? 3 : status == "Middle" ? 2 : 1;
  };
  if (name.name_add == email) {
    return (
      <div className="panel-of-control-task">
        <h1>You have added this task</h1>
      </div>
    );
  } else if (name.state && name.nameOfTaker == email) {
    return (
      <div className="panel-of-control-task">
        <h1>You have completed the task</h1>
      </div>
    );
  } else if (name.state && name.nameOfTaker !== email) {
    return (
      <div className="panel-of-control-task">
        <h1>The task is completed by the user: {name.nameOfTaker}</h1>
      </div>
    );
  } else if (name.nameOfTaker == email) {
    return (
      <div className="panel-of-control-task">
        <h1>The task is assigned to you</h1>
        <button
          onClick={() => {
            completedTask(true);
          }}
        >
          Complete the task
        </button>
        <button
          onClick={() => {
            refuseAssignment();
          }}
        >
          Refuse to task
        </button>
      </div>
    );
  } else if (name.nameOfTaker.length > 0) {
    return (
      <div className="panel-of-control-task">
        <h1>The task is cried with the user: {name.nameOfTaker}</h1>
      </div>
    );
  } else if (
    !(
      name.role.findIndex((e) => e.role !== roleProfileInBoard.role) == -1 &&
      name.role.findIndex(
        (e) => statusProfile(e.level) <= statusProfile(roleProfileInBoard.level)
      ) !== -1
    ) ||
    roleProfileInBoard.role == "Product manager"
  ) {
    return (
      <div className="panel-of-control-task">
        <h1>You do not have the right to take this task</h1>
      </div>
    );
  } else {
    return (
      <div className="take-task-btn">
        <button onClick={addNameOfTaker}>Take up execution</button>
      </div>
    );
  }
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { roleProfileInBoard, cardFull, activData },
}) => {
  return { token, roleProfileInBoard, cardFull, activData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recentActivity: (activData) => {
      dispatch(recentActivity(activData));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardOfTaker);
