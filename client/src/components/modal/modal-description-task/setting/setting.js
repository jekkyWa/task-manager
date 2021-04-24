import React, { useState } from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";
import { recentActivity } from "../../../../action/action-save-date";
import { modalShow, modalRoleChange } from "../../../../action/action-modal";
import { roleDependencies } from "../../../role";
import { connect } from "react-redux";
import "./setting.scss";

const Setting = ({
  email,
  socket,
  dataToModal,
  modalShow,
  modalRoleChange,
  cardFull,
  roleProfileInBoard,
}) => {
  const item = cardFull.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];
  const setting = item.card_body.filter((e) => dataToModal.id == e.id_task)[0];

  const [showCard, setShowCard] = useState(false);

  const [renameBody, setRenameBody] = useState("");

  const [showChangeRole, setShowChangeRole] = useState(false);

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

  const addList = async (dataBool) => {
    await socket.emit("addCheckList", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      dataBool,
    });
  };

  const [roleHandler, setRoleHandler] = useState("");
  const [dataRole, setDataRole] = useState({
    role: "Back-end developer",
    level: "Junior",
  });

  const changeRoleFunc = async () => {
    const arrRole = roleHandler.split(", ");
    const newItem = arrRole.map((e, i) => {
      const id = e.lastIndexOf("-");
      return (e = {
        role: e.slice(0, id).trim(),
        level: e.slice(id + 1).trim(),
      });
    });
    console.log(newItem);
    await socket.emit("changeRole", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: newItem,
    });
    modalRoleChange(false);
    modalShow(true);
  };

  // Adding a role in the form
  const addRole = () => {
    setRoleHandler(
      (prev) =>
        `${prev.length !== 0 ? prev + ", " : prev} ${dataRole.role}-${
          dataRole.level
        }`
    );
  };

  // Processing form data, block for adding roles and levels
  const inputRoleHandler = (e) => {
    setRoleHandler(e.target.value);
  };

  // Processing role data and levels
  const roleAndLvlHandler = (e) => {
    setDataRole({ ...dataRole, [e.target.name]: e.target.value });
  };

  if (setting.name_add == email) {
    return (
      <React.Fragment>
        <div className="modal-description-setting">
          <div>
            <SettingsIcon />
          </div>
          <h2>Settings</h2>
        </div>
        <div className="buttons-settings">
          <div>
            <h1>
              Add a check list for more convenient task management. Slide one
              task for a few small!
            </h1>
            <button
              onClick={() => {
                addList(true);
              }}
            >
              Add
            </button>
          </div>
          <div>
            <h1>
              Change the task. When the task is changed, if it was taken, it
              will not be canceled, but the user may refuse its execution. Do
              not change the task dramatically!
            </h1>
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
                className="modal-description-close-icon-setting"
                onClick={() => {
                  setShowCard(false);
                  setRenameBody("");
                }}
              />
            </div>
          </div>
          <div>
            <h1>
              The change in the role will also not lead to automatic refusal of
              the job, but the user will not complete it, change the roles with
              the mind!
            </h1>
            <button
              className={showChangeRole ? "hidden" : ""}
              onClick={() => {
                setShowChangeRole(true);
              }}
            >
              Change role
            </button>
          </div>
          <div className={!showChangeRole ? "hidden" : ""}>
            <input
              placeholder="List participants in role-level format separated by commas"
              value={roleHandler}
              onChange={inputRoleHandler}
            />
            <div className="measure-role">
              {roleDependencies(roleProfileInBoard, roleAndLvlHandler)}
            </div>
            <button className="modal-role-change-btn" onClick={addRole}>
              Add role to form
            </button>
            <button
              className="modal-role-change-btn"
              onClick={() => {
                changeRoleFunc();
                setShowChangeRole(false);
              }}
            >
              Save
            </button>
            <CloseIcon
              className="modal-description-close-icon-setting"
              onClick={() => {
                setShowChangeRole(false);
              }}
            />
          </div>
          <div>
            <h1>
              Deleting a task, it will be impossible to restore the data.Think
              again before deleting the task.
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
  reducerSaveData: { roleProfileInBoard, valueDisplay, activData, cardFull },
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
