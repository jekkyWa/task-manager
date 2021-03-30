import React, { useState, useEffect } from "react";
import { roleDependencies } from "../role";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import {
  modalRoleChange,
  roleForNewTask,
  modalShow,
} from "../../action/action-login";

const ModalChangeRole = ({
  roleProfileInBoard,
  roleForNewTask,
  modalRoleChange,
  changeRole,
  modalShow,
  dataToModal,
  socket,
}) => {
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

  useEffect(() => {
    console.log(dataToModal);
  }, [dataToModal]);

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

  // Saving all added roles for the task
  const addRolesToSend = () => {};

  return (
    <Modal
      show={changeRole}
      onHide={() => {
        modalRoleChange(false);
        modalShow(true);
      }}
      dialogClassName="modal-50w"
      dialogClassName="modal-50w"
    >
      <Modal.Body>
        <div className="modal-role-change">
          <div className="header-modal-role-change">
            <p>Изменить роли, для выполнения задания</p>
            <div>
              <CloseIcon
                className="close-icon"
                onClick={() => {
                  modalRoleChange(false);
                  modalShow(true);
                }}
              />
            </div>
          </div>
          <div>Выбранные роли в данный момент: "{dataToModal.role}"</div>
          <input
            placeholder="List participants in role-level format separated by commas"
            value={roleHandler}
            onChange={inputRoleHandler}
          />
          <div className="select-modal-role-change">
            {roleDependencies(roleProfileInBoard, roleAndLvlHandler)}
          </div>
          <button className="modal-role-change-btn" onClick={addRole}>
            Add role to form
          </button>
          <button className="modal-role-change-btn" onClick={changeRoleFunc}>
            Save and close
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = ({
  getDataReducer: { roleProfileInBoard, changeRole, socket },
}) => {
  return {
    roleProfileInBoard,
    changeRole,
    socket,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    modalRoleChange: (changeRole) => {
      dispatch(modalRoleChange(changeRole));
    },
    roleForNewTask: (saveRole) => {
      dispatch(roleForNewTask(saveRole));
    },
    modalShow: (show) => {
      dispatch(modalShow(show));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalChangeRole);
