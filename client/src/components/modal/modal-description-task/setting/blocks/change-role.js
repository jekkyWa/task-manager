import React, { Fragment, useState } from "react";
// files
import { roleDependencies } from "../../../../role";
// material
import CloseIcon from "@material-ui/icons/Close";

const ChangeRole = ({
  changeRoleFunc,
  setRoleHandler,
  dataRole,
  roleHandler,
  roleProfileInBoard,
  roleAndLvlHandler,
}) => {
  const [showChangeRole, setShowChangeRole] = useState(false);

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
  return (
    <Fragment>
      <div>
        <h1>
          The change in the role will also not lead to automatic refusal of the
          job, but the user will not complete it, change the roles with the
          mind!
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
          value={roleHandler.replace(/^ +/gm, "")}
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
            setRoleHandler("");
          }}
        >
          Save
        </button>
        <CloseIcon
          className="modal-description-close-icon-setting"
          onClick={() => {
            setShowChangeRole(false);
            setRoleHandler("");
          }}
        />
      </div>
    </Fragment>
  );
};

export default ChangeRole;
