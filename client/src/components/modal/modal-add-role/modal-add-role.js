import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
// files
import { roleDependencies } from "../../role";
import "./modal-add-role.scss";
// redux
import { connect } from "react-redux";
import { modalRoleShow, roleHandler } from "../../../action/action-modal";
import { roleForNewTask } from "../../../action/action-save-date";
// material
import CloseIcon from "@material-ui/icons/Close";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";

const ModalAddRole = ({
  roleProfileInBoard,
  roleForNewTask,
  modalRoleShow,
  roleShow,
  roleHandler,
  modalRoleData,
}) => {
  const [dataRole, setDataRole] = useState({
    role: "",
    level: "",
  });
  const [error, setError] = useState([]);

  // Adding a role in the form
  const addRole = () => {
    if (!dataRole.role || !dataRole.level) {
      return setError(["Fill in all data to add a role."]);
    }
    // Checking there is exactly the same value in the added roles.
    const validRole = modalRoleData.filter(
      (e) => e.role == dataRole.role && e.level == dataRole.level
    );
    // Check whether there is the same role in the added roles
    const indexLevel = modalRoleData.findIndex((e) => e.role == dataRole.role);
    if (validRole.length >= 1) {
      return setError([
        "You can not add two identical roles: ",
        `${dataRole.role}-${dataRole.level}`,
      ]);
    }
    if (indexLevel !== -1) {
      setError("");
      return roleHandler([
        ...modalRoleData.slice(0, indexLevel),
        ...modalRoleData.slice(indexLevel + 1),
        dataRole,
      ]);
    }
    setError([]);
    roleHandler([...modalRoleData, dataRole]);
  };

  // Processing role data and levels
  const roleAndLvlHandler = (e) => {
    setError([]);
    setDataRole({ ...dataRole, [e.target.name]: e.target.value });
  };

  // Saving all added roles for the task
  const addRolesToSend = () => {
    roleForNewTask(modalRoleData);
    modalRoleShow(false);
  };

  const label = modalRoleData.map((e, i) => {
    return (
      <div className="role-block" key={i}>
        <h1>{`${e.role}-${e.level}`}</h1>
        <CloseIcon
          onClick={() => {
            setError([]);
            roleHandler([
              ...modalRoleData.slice(0, i),
              ...modalRoleData.slice(i + 1),
            ]);
          }}
          className="delete-role"
        />
      </div>
    );
  });

  return (
    <Modal
      show={roleShow}
      onHide={() => {
        modalRoleShow(false);
        addRolesToSend();
        setError([]);
        setDataRole({
          role: "",
          level: "",
        });
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
                  addRolesToSend();
                  setError([]);
                  setDataRole({
                    role: "",
                    level: "",
                  });
                }}
              />
            </div>
          </div>
          <h1>
            Please select the necessary roles for the task, you can select only
            one of three levels (Junior, Middle or Senior).
          </h1>
          <div
            className={error.length !== 0 ? "error-modal-add-role" : "hidden"}
          >
            <div>
              <ErrorOutlineOutlinedIcon fontSize="small" />
            </div>
            <h1>
              {error[0]}
              <span>{error[1]}</span>
            </h1>
          </div>
          <div className="role-container">{label}</div>
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
              Close
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = ({
  reducerSaveData: { roleProfileInBoard },
  reducerModal: { roleShow, modalRoleData },
  reducerState: { clearRoleState },
}) => {
  return {
    roleProfileInBoard,
    roleShow,
    clearRoleState,
    modalRoleData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    roleHandler: (modalRoleData) => {
      dispatch(roleHandler(modalRoleData));
    },
    modalRoleShow: (roleShow) => {
      dispatch(modalRoleShow(roleShow));
    },
    roleForNewTask: (saveRole) => {
      dispatch(roleForNewTask(saveRole));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddRole);
