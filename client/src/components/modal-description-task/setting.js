import React, { useState } from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";
import {
  recentActivity,
  modalShow,
  modalRoleChange,
} from "../../action/action-login";
import { connect } from "react-redux";

const Setting = ({
  email,
  socket,
  dataToModal,
  modalShow,
  modalRoleChange,
  cardFull,
}) => {
  const item = cardFull.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];
  const setting = item.card_body.filter((e) => dataToModal.id == e.id_task)[0];

  const [showCard, setShowCard] = useState(false);

  const [renameBody, setRenameBody] = useState("");

  const renameHandler = (e) => {
    setRenameBody(e.target.value);
  };

  const deleteTask = async () => {
    modalShow(false);
    await socket.emit("deleteTask", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
    });
  };

  const renameFunc = async () => {
    await socket.emit("rename", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: renameBody,
    });
  };

  if (setting.name_add == email) {
    return (
      <React.Fragment>
        <div className="modal-description-add-description">
          <div>
            <SettingsIcon />
          </div>
          <div>
            <h2>Settings</h2>
          </div>
        </div>
        <div className="buttons-settings">
          <div>
            <h1>Добавить чек-лист:</h1>
            <button onClick={() => {}}>Добавить</button>
          </div>
          <div>
            <h1>Rename the selected task:</h1>
            <button
              className={!showCard ? "" : "hidden"}
              onClick={() => {
                setShowCard(true);
              }}
            >
              Rename
            </button>
            <div className={showCard ? "" : "hidden"}>
              <input
                onChange={renameHandler}
                value={renameBody}
                placeholder="Rename"
              />
            </div>
            <div className={showCard ? "" : "hidden"}>
              <button className="save-btn" onClick={renameFunc}>
                Save
              </button>
              <CloseIcon
                className="modal-description-close-icon"
                onClick={() => {
                  setShowCard(false);
                  setRenameBody("");
                }}
              />
            </div>
          </div>
          <div>
            <h1>Change the roles to perform this task:</h1>
            <button
              onClick={() => {
                modalShow(false);
                modalRoleChange(true);
              }}
            >
              Change role
            </button>
          </div>
          <div>
            <h1>
              Delete task, press with an allocated to restore the task it is
              impossible:
            </h1>
            <button
              className="delete-task"
              onClick={() => {
                deleteTask();
              }}
            >
              Delete task
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
  return null;
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { roleProfileInBoard, valueDisplay, activData, cardFull },
}) => {
  return { token, roleProfileInBoard, valueDisplay, activData, cardFull };
};

const mapDispatchToProps = (dispatch) => {
  return {
    modalRoleChange: (changeRole) => {
      dispatch(modalRoleChange(changeRole));
    },
    recentActivity: (activData) => {
      dispatch(recentActivity(activData));
    },
    modalShow: (show) => {
      dispatch(modalShow(show));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
