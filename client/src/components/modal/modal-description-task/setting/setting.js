import React, { useState, Fragment, useEffect } from "react";
// files
import "./setting.scss";
import AddList from "./blocks/add-list";
// material
import SettingsIcon from "@material-ui/icons/Settings";
import Rename from "./blocks/rename";
import ChangeRole from "./blocks/change-role";
import Delete from "./blocks/delete";

const Setting = ({
  email,
  socket,
  dataToModal,
  modalShow,
  cardFull,
  roleProfileInBoard,
}) => {
  const [renameBody, setRenameBody] = useState("");
  const [dataRole, setDataRole] = useState({
    role: "Back-end developer",
    level: "Junior",
  });
  const [roleHandler, setRoleHandler] = useState("");

  useEffect(() => {
    console.log(dataToModal);
  }, [dataToModal]);

  // Filter data
  const item = cardFull.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];
  const setting = item.card_body.filter((e) => dataToModal.id == e.id_task)[0];

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

  // Change role
  const changeRoleFunc = async () => {
    const arrRole = roleHandler.split(", ");
    const newItem = arrRole.map((e, i) => {
      const id = e.lastIndexOf("-");
      return (e = {
        role: e.slice(0, id).trim(),
        level: e.slice(id + 1).trim(),
      });
    });
    await socket.emit("changeRole", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: newItem,
    });
    modalShow(true);
  };

  // Processing role data and levels
  const roleAndLvlHandler = (e) => {
    setDataRole({ ...dataRole, [e.target.name]: e.target.value });
  };

  // For the task
  if (setting.name_add == email) {
    return (
      <Fragment>
        <div className="modal-description-setting">
          <div>
            <SettingsIcon />
          </div>
          <h2>Settings</h2>
        </div>
        <div className="buttons-settings">
          <AddList addList={addList} />
          <Rename
            renameHandler={renameHandler}
            renameFunc={renameFunc}
            renameBody={renameBody}
            setRenameBody={setRenameBody}
          />
          <ChangeRole
            changeRoleFunc={changeRoleFunc}
            setRoleHandler={setRoleHandler}
            dataRole={dataRole}
            roleHandler={roleHandler}
            roleProfileInBoard={roleProfileInBoard}
            roleAndLvlHandler={roleAndLvlHandler}
          />
          <Delete deleteTask={deleteTask} />
        </div>
      </Fragment>
    );
  }
  // Check, is the user, those who took the task
  if (dataToModal.name_take == email) {
    return (
      <Fragment>
        <div className="modal-description-setting">
          <div>
            <SettingsIcon />
          </div>
          <h2>Settings</h2>
        </div>
        <div className="buttons-settings">
          <AddList addList={addList} />
        </div>
      </Fragment>
    );
  }
  return null;
};

export default Setting;
