import React, { useEffect } from "react";
import dateFormat from "dateformat";
// files
import "./card-of-taker.scss";

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
  const refuseAssignment = async () => {
    await socket.emit("refuseAssignment", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
    });
  };

  // Last Activity: Took the task
  useEffect(() => {
    if (socket) {
      socket.on("taskTake", (value) => {
        recentActivity(value);
      });
      return () => socket.off("taskTake");
    }
  }, [socket, activData]);

  // Check status for further display
  const statusProfile = (status) => {
    return status == "Senior" ? 3 : status == "Middle" ? 2 : 1;
  };
  // If another user took the task and fulfilled it
  if (name.state && name.nameOfTaker !== email) {
    return (
      <div className="panel-of-control-task">
        <h1>
          The task is completed by the user: <span>{name.nameOfTaker}</span>.
        </h1>
      </div>
    );
  }
  // If the user took this task and executed it
  if (name.state && name.nameOfTaker == email) {
    return (
      <div className="panel-of-control-task">
        <h1>You have completed the task.</h1>
      </div>
    );
  }
  if (
    name.nameOfTaker == email &&
    name.role.findIndex((e) => e.role == roleProfileInBoard.role) == -1 &&
    name.role.findIndex(
      (e) => statusProfile(e.level) <= statusProfile(roleProfileInBoard.level)
    ) !== -1
  ) {
    return (
      <div className="panel-of-control-task">
        <h1>
          The creator of the task has changed the role to perform this task. The
          creator of the task has changed the role to perform this task.
        </h1>
        <div>
          <button
            className="refuse-panel-of-control-task"
            onClick={() => {
              refuseAssignment();
            }}
          >
            Refuse to task
          </button>
        </div>
      </div>
    );
  }
  if (name.nameOfTaker == email) {
    // If the user just took the task
    return (
      <div className="panel-of-control-task">
        <h1>
          This task is assigned to you. If you cannot complete it, refuse. Or
          complete the task if you completed it.
        </h1>
        <div>
          <button
            className="complete-panel-of-control-task"
            onClick={() => {
              completedTask(true);
            }}
          >
            Complete the task
          </button>
          <button
            className="refuse-panel-of-control-task"
            onClick={() => {
              refuseAssignment();
            }}
          >
            Refuse to task
          </button>
        </div>
      </div>
    );
  }
  // If someone just took the task
  if (name.nameOfTaker.length > 0) {
    return (
      <div className="panel-of-control-task">
        <h1>
          The task is assigned to the user: <span>{name.nameOfTaker}</span>.
        </h1>
      </div>
    );
  }
  // If the user added this task
  if (name.name_add == email) {
    return (
      <div className="panel-of-control-task">
        <h1>You have added this task.</h1>
      </div>
    );
  }
  // Checking the ability to take a task
  if (
    (name.role.findIndex((e) => e.role == roleProfileInBoard.role) == -1 &&
      name.role.findIndex(
        (e) => statusProfile(e.level) <= statusProfile(roleProfileInBoard.level)
      ) !== -1) ||
    roleProfileInBoard.role == "Product manager"
  ) {
    return (
      <div className="panel-of-control-task">
        <h1>You do not have the right to take this task.</h1>
      </div>
    );
  }
  return (
    <div className="take-task-btn">
      <h1>As soon as you click the button, you will take this task.</h1>
      <button onClick={addNameOfTaker}>Take up execution</button>
    </div>
  );
};

export default CardOfTaker;
