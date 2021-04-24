import React from "react";
import { connect } from "react-redux";
import FormatListNumberedRtlIcon from "@material-ui/icons/FormatListNumberedRtl";
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import shortid from "shortid";
import "./check-list.scss";

const CheckList = ({ cardFull, dataToModal, socket }) => {
  const [addItemCheckListState, setAddItemCheckListState] = useState(false);
  const [titleCheckListItem, setTitleCheckListItem] = useState("");

  const titleListHandler = (e) => {
    setTitleCheckListItem(e.target.value);
  };

  // Receive the data of the desired card
  const item = cardFull.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];
  const checkList = item.card_body.filter(
    (e) => dataToModal.id == e.id_task
  )[0];

  const deleteList = async (dataBool) => {
    await socket.emit("addCheckList", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      dataBool,
    });
  };

  const addCheckListItem = async () => {
    const id_check_list_item = shortid.generate();
    await socket.emit("addCheckListItem", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: {
        titleCheckListItem: titleCheckListItem,
        status: false,
        id_check_list_item,
      },
    });
  };

  const changeStatysCheckListItem = async (id, statusBool) => {
    await socket.emit("changeStatusListItem", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      id_check_list_item: id,
      statusBool,
    });
  };

  const deleteCheckListItem = async (id) => {
    await socket.emit("deleteCheckListItem", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      id_check_list_item: id,
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
          <div className="check-list-two">
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
        {checkList.check_letter.list.map((e) => {
          return (
            <div className="radio-block">
              <div
                onClick={() => {
                  const status = !e.status;
                  changeStatysCheckListItem(e.id_check_list_item, status);
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
                  <CloseIcon />
                </h2>
              </div>
            </div>
          );
        })}
        <button
          onClick={() => {
            setAddItemCheckListState(true);
          }}
          className={
            !addItemCheckListState ? "add-check-list-item-btn" : "hidden"
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

const mapStateToProps = ({
  loginReducer: { token },
  reducerSaveData: { roleProfileInBoard, cardFull, activData },
}) => {
  return { token, roleProfileInBoard, cardFull, activData };
};

//   const mapDispatchToProps = (dispatch) => {
//     return {
//       recentActivity: (activData) => {
//         dispatch(recentActivity(activData));
//       },
//     };
//   };

export default connect(mapStateToProps, null)(CheckList);
