import React, { useState } from "react";
import { Modal } from "react-bootstrap";
// files
import { roleDependencies } from "../../role";
import "./modal-add-role.scss";
// redux
import { connect } from "react-redux";
import { modalRoleShow } from "../../../action/action-modal";
import { roleForNewTask } from "../../../action/action-save-date";
// material
import CloseIcon from "@material-ui/icons/Close";

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
    // If "value" is empty, then add a change without a comma
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
    // We divide the entered data on an array
    const arrRole = roleHandler.split(", ");
    // We convert all the values of the array in the type of type {Role: Value, Level: Value},
    // where 2 elements are divided by the principle of Role, Level
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
        setRoleHandler("");
      }}
      dialogClassName="modal-50w"
    >
      <Modal.Body>
        <div className="modal-role-change">
          <div className="header-modal-role-change">
            <p>Select roles to perform the task</p>
            <div>
              <CloseIcon
                className="close-icon-modal-add-role"
                onClick={() => {
                  modalRoleShow(false);
                }}
              />
            </div>
          </div>
          <h1>List participants in role-level format separated by commas</h1>
          <input
            placeholder="Enter the data in the Role-Level, Role-Level format or select the right roles below."
            // We remove the extra space at the beginning
            value={roleHandler.replace(/^ +/gm, "")}
            onChange={inputRoleHandler}
          />
          <div className="select-modal-role-change">
            {/* Display "select" depending on the roles */}
            {roleDependencies(roleProfileInBoard, roleAndLvlHandler)}
          </div>
          <div className="btn-block-modal-role-change">
            <button className="modal-role-change-btn" onClick={addRole}>
              Add role to form
            </button>
            <button
              className="modal-role-change-btn save-btn-modal-add-role"
              onClick={addRolesToSend}
            >
              Save and close
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = ({
  reducerSaveData: { roleProfileInBoard },
  reducerModal: { roleShow },
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
