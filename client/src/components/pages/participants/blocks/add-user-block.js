import React from "react";
import CloseIcon from "@material-ui/icons/Close";

const AddUserBlock = ({
  showInputAdd,
  setShowInputAdd,
  onEmailHandler,
  onRoleHandler,
  addNewUserToBoard,
}) => {
  return (
    <div className={showInputAdd ? "" : "hidden"}>
      <div className="add-user-email-partic">
        <p>Email</p>
        <input onChange={onEmailHandler} placeholder="Please, enter email" />
      </div>
      <div className="add-user-role-partic">
        <p>Role in the project</p>
        <select name="role" onChange={onRoleHandler}>
          <option>Back-end developer</option>
          <option>Front-end developer</option>
          <option>QA</option>
          <option>Business Analyst</option>
          <option>UX/UI designer</option>
          <option>Marketing specialist</option>
          <option>Product manager</option>
        </select>
      </div>
      <div className="add-user-role-partic">
        <p>Level</p>
        <select name="level" onChange={onRoleHandler}>
          <option>Junior</option>
          <option>Middle</option>
          <option>Senior</option>
        </select>
      </div>
      <div className="add-user-partic-active">
        <button
          onClick={() => {
            addNewUserToBoard();
            setShowInputAdd(false);
          }}
        >
          Add user
        </button>
        <div
          className="close-icon-partic"
          onClick={() => {
            setShowInputAdd(false);
          }}
        >
          <CloseIcon />
        </div>
      </div>
    </div>
  );
};

export default AddUserBlock;
