import React from "react";
// material
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CloseIcon from "@material-ui/icons/Close";

const RadioItem = ({
  checkList,
  name_take,
  email,
  id_board,
  id_card,
  id_task,
  socket,
}) => {
  // Change status: done, not performed
  const changeStatusCheckListItem = async (id, statusBool) => {
    await socket.emit("changeStatusListItem", {
      id_board,
      id_card,
      id_task,
      id_check_list_item: id,
      statusBool,
    });
  };

  // Remove subtask
  const deleteCheckListItem = async (id) => {
    await socket.emit("deleteCheckListItem", {
      id_board,
      id_card,
      id_task,
      id_check_list_item: id,
    });
  };

  const label = checkList.check_letter.list.map((e) => {
    return (
      <div
        className={`radio-block ${
          checkList.nameOfTaker == email ? "" : "radio-block-watch"
        }`}
      >
        <div
          onClick={() => {
            const status = !e.status;
            if (checkList.nameOfTaker == email)
              changeStatusCheckListItem(e.id_check_list_item, status);
          }}
          className="radio-item-list"
        >
          <CheckBoxOutlineBlankIcon
            className={e.status ? "hidden" : "icon-list-item"}
            fontSize="small"
          />
          <CheckBoxIcon
            className={!e.status ? "hidden" : "icon-list-item"}
            fontSize="small"
          />
          <h3 className={e.status ? "complite-text" : ""}>
            {e.titleCheckListItem}
          </h3>
        </div>
        <div>
          <h2
            onClick={() => {
              deleteCheckListItem(e.id_check_list_item);
            }}
          >
            <CloseIcon
              className={checkList.nameOfTaker == email ? "" : "hidden"}
            />
          </h2>
        </div>
      </div>
    );
  });
  return label;
};

export default RadioItem;
