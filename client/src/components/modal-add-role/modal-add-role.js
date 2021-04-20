import React, { useState } from "react";
import { roleDependencies } from "../role";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import "./modal-add-role.scss";
import { modalRoleShow } from "../../action/action-modal";
import {roleForNewTask} from "../../action/action-save-date"

const ModalAddRole = ({
  roleProfileInBoard,
  roleForNewTask,
  modalRoleShow,
  roleShow,
}) => {
  const [roleHandler, setRoleHandler] = useState("");
  const [dataRole, setDataRole] = useState({
    role: "Back-end developer",
    level: "Junior",
  });

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
  const addRolesToSend = () => {
    const arrRole = roleHandler.split(", ");
    const newItem = arrRole.map((e, i) => {
      const id = e.lastIndexOf("-");
      return (e = {
        role: e.slice(0, id).trim(),
        level: e.slice(id + 1).trim(),
      });
    });
    roleForNewTask(newItem);
    modalRoleShow(false);
  };

  return (
    <Modal
      show={roleShow}
      onHide={() => {
        modalRoleShow(false);
      }}
      dialogClassName="modal-50w"
    >
      <Modal.Body>
        <div className="modal-role-change">
          <div className="header-modal-role-change">
            <p>Выбрать роли для выполнения задания</p>
            <div>
              <CloseIcon
                className="close-icon"
                onClick={() => {
                  modalRoleShow(false);
                }}
              />
            </div>
          </div>
          List participants in role-level format separated by commas
          <input
            placeholder="Enter or select data"
            value={roleHandler}
            onChange={inputRoleHandler}
          />
          <div className="select-modal-role-change">
            {roleDependencies(roleProfileInBoard, roleAndLvlHandler)}
          </div>
          <button className="modal-role-change-btn" onClick={addRole}>
            Add role to form
          </button>
          <button className="modal-role-change-btn" onClick={addRolesToSend}>
            Save and close
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = ({
  getDataReducer: { roleProfileInBoard, roleShow },
}) => {
  return {
    roleProfileInBoard,
    roleShow,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    modalRoleShow: (roleShow) => {
      dispatch(modalRoleShow(roleShow));
    },
    roleForNewTask: (saveRole) => {
      dispatch(roleForNewTask(saveRole));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddRole);
