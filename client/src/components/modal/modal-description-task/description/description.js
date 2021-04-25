import React, { useState, useEffect } from "react";
import dateFormat from "dateformat";
// files
import "./description.scss";
// material
import CloseIcon from "@material-ui/icons/Close";

const DescriptionBlock = ({
  dataToModal,
  email,
  socket,
  recentActivity,
  activData,
  cardFull,
}) => {
  const [descriptionTask, setDescriptionTask] = useState("");
  const [descriptionState, setDescriptionState] = useState(false);

  // Filter required data
  const item = cardFull.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];
  const description = item.card_body.filter(
    (e) => dataToModal.id == e.id_task
  )[0];

  // Task description data
  const onChangeDescriptionTask = (e) => {
    setDescriptionTask(e.target.value);
  };

  // Adding data to the server
  const addDescriptionToTask = () => {
    let now = new Date();
    socket.emit("addDescriptionToTask", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: descriptionTask,
      dataActiv: {
        message: `User "${email}" updated/added a description "${descriptionTask}" to the task "${description.title}" in the card "${item.card_name}"`,
        email,
        date: dateFormat(now, "dd-mm-yyyy, hh:MM:ss "),
      },
    });
  };

  useEffect(() => {
    // Getting data if they have changed
    if (socket) {
      socket.on("descriptionTaskActivity", (value) => {
        recentActivity(value);
        setDescriptionState(false);
      });
      // After the data come to stop further sending
      return () => socket.off("descriptionTaskActivity");
    }
  }, [socket, activData]);

  // If the user has created a task
  if (dataToModal.name_add == email) {
    return (
      <div>
        <React.Fragment>
          <div
            className={
              !descriptionState ? "modal-description-select-input" : "hidden"
            }
            onClick={() => {
              setDescriptionState(true);
              setDescriptionTask(description.description);
            }}
          >
            {/* If the description disables the default value */}
            <p>
              {description.description
                ? description.description
                : "Add a more detailed description ..."}
            </p>
          </div>
          {/* Display form to enter a description  */}
          <div
            className={descriptionState ? "modal-description-input" : "hidden"}
          >
            <textarea
              value={descriptionTask}
              onChange={onChangeDescriptionTask}
            />
            <button
              className="modal-description-btn-save"
              onClick={addDescriptionToTask}
            >
              Save
            </button>
            <CloseIcon
              className="modal-description-close-icon"
              onClick={() => {
                setDescriptionState(false);
                setDescriptionTask(description.description);
              }}
            />
          </div>
        </React.Fragment>
      </div>
    );
  }
  // If the user is not a job creator, but the description exists
  if (description.description) {
    return (
      <p className="text-description-for-another-users">
        {description.description}
      </p>
    );
  }
  // Default value
  return (
    <p className="text-description-for-another-users">
      The creator of the task has not added any description.
    </p>
  );
};

export default DescriptionBlock;
