import React, { useState, useEffect } from "react";
// material
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SettingsIcon from "@material-ui/icons/Settings";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";

const ParticipantsItem = ({
  boardActive,
  socket,
  id,
  email,
  setDataForDelete,
  setModalShow,
}) => {
  const [selectRoleState, setSelectRoleState] = useState("");

  const [dataSelectUpdateRole, setDataSelectUpdateRole] = useState(
    "Back-end developer"
  );

  const [role, setRole] = useState("");

  // Saving data to change the role
  const onRoleUpdateHandler = (e) => {
    setDataSelectUpdateRole(e.target.value);
  };

  // Getting the current role in board
  const roleInBoard = () => {
    const index = boardActive.addedUsers.findIndex((e) => e.email == email);
    setRole(boardActive.addedUsers[index].role);
  };

  useEffect(() => {
    roleInBoard();
  }, [boardActive]);

  // Display body of patrticipant
  const label = boardActive.addedUsers.map((e, i) => {
    const addSelectForm = () => {
      setSelectRoleState(e.email);
    };
    const updateUserRole = async () => {
      socket.emit("updateRoleInCommand", {
        id: id.slice(id.length - 10),
        email: e.email,
        data: dataSelectUpdateRole,
      });
    };
    const updateUserLevel = async (value) => {
      const levelArr = ["Junior", "Middle", "Senior"];
      const index = levelArr.indexOf(e.level);
      socket.emit("updateLevelInCommand", {
        id: id.slice(id.length - 10),
        email: e.email,
        movement: value,
        currentState: index,
      });
    };
    const style = role == "Product manager";
    return (
      <div key={i} className="user-block-partic">
        <div className="user-item-partic">
          <div className="user-profile-icon-partic">
            <p>{e.email[0].toUpperCase()}</p>
          </div>
          <div className="info-user-partic">
            <p>Email: {e.email}</p>
            <p className={selectRoleState !== e.email ? "" : "hidden"}>
              Role:{e.role}{" "}
              <SettingsIcon
                className={style ? "setting-icon-partic" : "hidden"}
                onClick={() => {
                  addSelectForm();
                }}
                fontSize="small"
              />
            </p>
            <div
              className={
                selectRoleState == e.email ? "select-partic" : "hidden"
              }
            >
              <select onChange={onRoleUpdateHandler} name="role">
                <option>Back-end developer</option>
                <option>Front-end developer</option>
                <option>QA</option>
                <option>Business Analyst</option>
                <option>UX/UI designer</option>
                <option>Marketing specialist</option>
                <option>Product manager</option>
              </select>
              <CloseIcon
                className="panel-icon-partic"
                onClick={() => {
                  setSelectRoleState(false);
                }}
                fontSize="small"
              />
              <DoneIcon
                onClick={() => {
                  updateUserRole();
                  setSelectRoleState(false);
                }}
                className="panel-icon-partic"
                fontSize="small"
              />
            </div>
            <p>
              Level: {e.level}
              <ExpandLessIcon
                className={style ? "setting-icon-partic" : "hidden"}
                fontSize="small"
                onClick={() => {
                  updateUserLevel("up");
                }}
              />
              <ExpandMoreIcon
                className={style ? "setting-icon-partic" : "hidden"}
                fontSize="small"
                onClick={() => {
                  updateUserLevel("down");
                }}
              />
            </p>
            <p>
              Status:
              {e.memberStatus ? " Substrate" : " Waiting for confirmation"}
            </p>
          </div>
        </div>
        <div
          className={
            email == boardActive.creator ? "actions-with-users" : "hidden"
          }
        >
          <button
            className="delete-user-partic"
            onClick={() => {
              setModalShow(true);
              setDataForDelete({
                id: id.slice(id.length - 10),
                email: e.email,
              });
            }}
          >
            Delete the user
          </button>
        </div>
      </div>
    );
  });
  return label;
};

export default ParticipantsItem;
