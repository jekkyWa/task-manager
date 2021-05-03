import React, { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import shortid from "shortid";

const AddUserBlock = ({
  id,
  email,
  socket,
  error,
  showInputAdd,
  setShowInputAdd,
  setError,
  valid,
}) => {
  const [emailState, setEmailState] = useState("");
  const [roleState, setRoleState] = useState({
    role: "Choose",
    level: "Choose",
  });

  // Saving data about email new user
  const onEmailHandler = (e) => {
    setEmailState(e.target.value);
  };

  // Roles for adding a new user
  const onRoleHandler = (e) => {
    setRoleState({ ...roleState, [e.target.name]: e.target.value });
  };

  // Additional new user
  const addNewUserToBoard = () => {
    const id_notification = shortid.generate();
    socket.emit("addAdditionalUser", {
      board_id: id.slice(id.length - 10),
      data: { email: emailState, ...roleState, memberStatus: false, marks: [] },
      message: {
        title: `User ${email} invites you to the team ${id.slice(
          0,
          id.length - 10
        )}`,
        type: "AddingToCommand",
        from: email,
        id_notification,
        id_board: id.slice(id.length - 10),
      },
    });
  };

  const clearInput = () => {
    setShowInputAdd(false);
    setRoleState({ role: "Choose", level: "Choose" });
    setEmailState("");
    setError("");
  };

  const checkInputData = () => {
    if (
      roleState.role == "Choose" ||
      roleState.level == "Choose" ||
      emailState.length == 0
    ) {
      return setError("Please fill in the data");
    }
    if (
      !new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i).test(emailState)
    ) {
      return setError("Please enter correct email");
    }
    addNewUserToBoard();
  };

  useEffect(() => {
    if (valid) {
      clearInput();
    }
  }, [valid]);

  return (
    <div className={showInputAdd ? "add-user-block-body" : "hidden"}>
      <div className="add-user-email-partic">
        <p>Email</p>
        <input
          value={emailState}
          onChange={onEmailHandler}
          placeholder="Please, enter email"
        />
      </div>
      <div className="add-user-role-partic">
        <p>Role in the project</p>
        <select value={roleState.role} name="role" onChange={onRoleHandler}>
          <option value="Choose" disabled hidden>
            Choose the necessary role
          </option>
          <option value="Back-end developer">Back-end developer</option>
          <option value="Front-end developer">Front-end developer</option>
          <option value="QA">QA</option>
          <option value="Business Analyst">Business Analyst</option>
          <option value="UX/UI designer">UX/UI designer</option>
          <option value="Marketing specialist">Marketing specialist</option>
          <option value="Product manager">Product manager</option>
        </select>
      </div>
      <div className="add-user-role-partic">
        <p>Level</p>
        <select value={roleState.level} name="level" onChange={onRoleHandler}>
          <option value="Choose" disabled hidden>
            Choose the necessary level
          </option>
          <option value="Junior">Junior</option>
          <option value="Middle">Middle</option>
          <option value="Senior">Senior</option>
        </select>
      </div>
      <p className="error-add-user-block">{error}</p>
      <div className="add-user-partic-active">
        <button onClick={checkInputData}>Add user</button>
        <div
          className="close-icon-partic"
          onClick={() => {
            clearInput();
          }}
        >
          <CloseIcon />
        </div>
      </div>
    </div>
  );
};

export default AddUserBlock;
