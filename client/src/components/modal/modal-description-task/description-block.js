import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";
import dateFormat from "dateformat";
import { recentActivity } from "../../../action/action-save-date";

const DescriptionBlock = ({
  dataToModal,
  email,
  socket,
  valueDisplay,
  recentActivity,
  activData,
  cardFull
}) => {
  const [descriptionTask, setDescriptionTask] = useState("");
  const [descriptionState, setDescriptionState] = useState(false);

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
    setTimeout(() => {
      setDescriptionState(false);
    }, 100);
  };

  useEffect(() => {
    // Getting data if they have changed
    if (socket) {
      socket.on("descriptionTaskActivity", (value) => {
        recentActivity(value);
      });
      // After the data come to stop further sending
      return () => socket.off("descriptionTaskActivity");
    }
  }, [socket, activData]);

  // We find the desired description

  if (description.description && dataToModal.name_add == email) {
    return (
      <div>
        <React.Fragment>
          <div
            className={
              !descriptionState ? "modal-description-select-input" : "hidden"
            }
            onClick={() => {
              setDescriptionState(true);
            }}
          >
            <p>{description.description}</p>
          </div>
          <div
            className={descriptionState ? "modal-description-input" : "hidden"}
          >
            <textarea onChange={onChangeDescriptionTask} />
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
              }}
            />
          </div>
        </React.Fragment>
      </div>
    );
  } else if (description.description) {
    return <p>{description.description}</p>;
  } else if (dataToModal.name_add == email) {
    return (
      <React.Fragment>
        <div
          className={
            !descriptionState ? "modal-description-select-input" : "hidden"
          }
          onClick={() => {
            setDescriptionState(true);
          }}
        >
          <p>Add a more detailed description ...</p>
        </div>
        <div
          className={descriptionState ? "modal-description-input" : "hidden"}
        >
          <textarea onChange={onChangeDescriptionTask} />
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
            }}
          />
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <div>
        <p>The creator of the task has not added any description.</p>
      </div>
    );
  }
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { card, valueDisplay, activData, cardFull },
}) => {
  return { token, card, valueDisplay, activData, cardFull };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recentActivity: (activData) => {
      dispatch(recentActivity(activData));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DescriptionBlock);
