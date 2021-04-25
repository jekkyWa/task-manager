import React, { useState } from "react";
import shortid from "shortid";
// files
import "./check-list.scss";
// material
import FormatListNumberedRtlIcon from "@material-ui/icons/FormatListNumberedRtl";
import CloseIcon from "@material-ui/icons/Close";
import RadioItem from "./blocks/radio-item";

const CheckList = ({ cardFull, dataToModal, socket, email }) => {
  const [addItemCheckListState, setAddItemCheckListState] = useState(false);
  const [titleCheckListItem, setTitleCheckListItem] = useState("");

  // Receive the data of the desired card
  const item = cardFull.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];
  const checkList = item.card_body.filter(
    (e) => dataToModal.id == e.id_task
  )[0];

  const titleListHandler = (e) => {
    setTitleCheckListItem(e.target.value);
  };

  const {
    board_id: id_board,
    card_id: id_card,
    id: id_task,
    name_take,
  } = dataToModal;

  // Removal Check-List
  const deleteList = async (dataBool) => {
    await socket.emit("addCheckList", {
      id_board,
      id_card,
      id_task,
      dataBool,
    });
  };

  // Add subtask
  const addCheckListItem = async () => {
    const id_check_list_item = shortid.generate();
    await socket.emit("addCheckListItem", {
      id_board,
      id_card,
      id_task,
      data: {
        titleCheckListItem: titleCheckListItem,
        status: false,
        id_check_list_item,
      },
    });
  };

  // Check: Created Leaf Check
  if (checkList.check_letter.availability) {
    return (
      <div>
        <div className="check-list">
          <div className="check-list-one">
            <div>
              <FormatListNumberedRtlIcon fontSize="medium" />
            </div>
            <h2>Check letter</h2>
          </div>
          <div className={name_take == email ? "check-list-two" : "hidden"}>
            <button
              onClick={() => {
                deleteList(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="progress-bar-check-list">
          <h1>
            {checkList.check_letter.list.length !== 0
              ? Math.round(
                  (checkList.check_letter.list.filter((e) => e.status).length /
                    checkList.check_letter.list.length) *
                    100
                )
              : 0}
            %
          </h1>{" "}
          <div className="progressbar">
            <div
              className="progress"
              style={{
                width: `${
                  checkList.check_letter.list.length !== 0
                    ? Math.round(
                        (checkList.check_letter.list.filter((e) => e.status)
                          .length /
                          checkList.check_letter.list.length) *
                          100
                      )
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
        <RadioItem
          checkList={checkList}
          name_take={name_take}
          email={email}
          id_board={id_board}
          id_card={id_card}
          id_task={id_task}
          socket={socket}
        />
        <button
          onClick={() => {
            setAddItemCheckListState(true);
          }}
          className={
            !addItemCheckListState && name_take == email
              ? "add-check-list-item-btn"
              : "hidden"
          }
        >
          Add item
        </button>
        <div
          className={
            addItemCheckListState
              ? "modal-description-input-check-list"
              : "hidden"
          }
        >
          <textarea placeholder="Add item" onChange={titleListHandler} />
          <button
            onClick={addCheckListItem}
            className="modal-description-btn-save-check-list"
          >
            Add
          </button>
          <CloseIcon
            onClick={() => {
              setAddItemCheckListState(false);
            }}
            className="modal-description-close-icon-check-list"
          />
        </div>
      </div>
    );
  }
  return null;
};

export default CheckList;
