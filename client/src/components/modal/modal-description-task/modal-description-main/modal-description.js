import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
// files
import "./modal-description.scss";
import DescriptionBlock from "../description/description";
import { availCheck } from "../../../utils/availability-check";
import CardOfTaker from "../card-of-taker/card-of-taker";
import Comment from "../comment/comment";
import CheckList from "../check-list/check-list";
import Setting from "../setting/setting";
// redux
import { modalShow } from "../../../../action/action-modal";
import {
  saveActivityCard,
  saveFullCard,
  displaySelection,
} from "../../../../action/action-save-date";
import { connect } from "react-redux";
import { recentActivity } from "../../../../action/action-save-date";
// materail
import ReorderIcon from "@material-ui/icons/Reorder";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import HeaderModalDescription from "../header-modal-desription/header-modal-description";

const ModalDescription = ({
  activData,
  show,
  dataToModal,
  email,
  socket,
  card,
  cardFull,
  saveActivityCard,
  roleProfileInBoard,
  saveFullCard,
  valueDisplay,
  displaySelection,
  modalShow,
  recentActivity,
}) => {
  const [idDel, setIdDel] = useState("");

  // Saving and display the data obtained
  const bodyEffect = (value) => {
    if (dataToModal) {
      // Search for the right task
      const item = value.cards.filter(
        (e) => e.card_item_id == dataToModal.card_id
      )[0];
      // Saving data for the current user role
      saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
      // Manipulation with the task
      const index = valueDisplay.valueDisp.cards.findIndex(
        (e) => e.card_item_id == item.card_item_id
      );
      const newItem = {
        ...valueDisplay.valueDisp,
        cards: [
          ...cardFull.cards.slice(0, index),
          item,
          ...cardFull.cards.slice(index + 1),
        ],
      };
      // Saving all data
      saveFullCard(newItem);
      if (!valueDisplay.stateFilter) {
        // Displays all tasks
        displaySelection({ valueDisp: newItem, stateFilter: false });
      } else {
        // Display of filtered data
        displaySelection({
          valueDisp: availCheck(
            item,
            valueDisplay.valueDisp,
            roleProfileInBoard
          ),
          stateFilter: true,
        });
      }
    }
  };

  // Change name
  useEffect(() => {
    if (socket) {
      socket.on("getRenameData", (value) => {
        bodyEffect(value);
      });
      return () => socket.off("getRenameData");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Adding a description of the task
  useEffect(() => {
    if (socket) {
      socket.on("newDescriptionTask", (value) => {
        bodyEffect(value);
      });
      return () => socket.off("newDescriptionTask");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Propulation Task for the user
  useEffect(() => {
    if (socket) {
      socket.on("newUserToDo", (value) => {
        bodyEffect(value);
      });
      return () => socket.off("newUserToDo");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Additional comment
  useEffect(() => {
    if (socket) {
      socket.on("newComment", (value) => {
        bodyEffect(value);
      });
      return () => socket.off("newComment");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Get a check list
  useEffect(() => {
    if (socket) {
      socket.on("getCheckList", (value) => {
        bodyEffect(value);
      });
      return () => socket.off("getCheckList");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Get a check list item
  useEffect(() => {
    if (socket) {
      socket.on("getCheckListItem", (value) => {
        bodyEffect(value);
      });
      return () => socket.off("getCheckListItem");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Get a check list item with new status
  useEffect(() => {
    if (socket) {
      socket.on("getChangeStatusListItem", (value) => {
        bodyEffect(value);
      });
      return () => socket.off("getChangeStatusListItem");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Remove subtask
  useEffect(() => {
    if (socket) {
      socket.on("getDataAfterDeleteCheckListItem", (value) => {
        bodyEffect(value);
      });
      return () => socket.off("getDataAfterDeleteCheckListItem");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Refusal of the task
  useEffect(() => {
    if (socket) {
      socket.on("getRefuseAssignment", (value) => {
        bodyEffect(value);
      });
      return () => socket.off("getRefuseAssignment");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Update status in the database If the tasks are executed
  useEffect(() => {
    if (socket) {
      socket.on("updateStateComplit", (value) => {
        bodyEffect(value);
      });
      return () => socket.off("updateStateComplit");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Delete task
  useEffect(() => {
    if (socket) {
      socket.on("getDataAfterDelete", (value) => {
        if (dataToModal) {
          setIdDel(value.id);
          // Saving data for the current user role
          saveActivityCard({
            ...availCheck(
              value.body,
              valueDisplay.valueDisp,
              roleProfileInBoard
            ),
          });
          // Manipulation with the task
          const index = valueDisplay.valueDisp.cards.findIndex(
            (e) => e.card_item_id == value.body.card_item_id
          );
          const newItem = {
            ...valueDisplay.valueDisp,
            cards: [
              ...cardFull.cards.slice(0, index),
              value.body,
              ...cardFull.cards.slice(index + 1),
            ],
          };
          // Saving all data
          saveFullCard(newItem);
          if (!valueDisplay.stateFilter) {
            // Displays all tasks
            displaySelection({ valueDisp: newItem, stateFilter: false });
          } else {
            // Display of filtered data
            displaySelection({
              valueDisp: availCheck(
                value.body,
                valueDisplay.valueDisp,
                roleProfileInBoard
              ),
              stateFilter: true,
            });
          }
        }
      });
      // After the data come to stop further sending
      return () => socket.off("getDataAfterDelete");
    }
  }, [socket, valueDisplay, dataToModal]);

  if (dataToModal.id == idDel) {
    return (
      <Modal
        dialogClassName="modal-60w"
        show={show}
        onHide={() => {
          modalShow(false);
        }}
      >
        <Modal.Body>User deleted this task</Modal.Body>
      </Modal>
    );
  } else {
    return (
      <Modal
        dialogClassName="modal-60w"
        show={show}
        onHide={() => {
          modalShow(false);
        }}
      >
        <Modal.Body>
          <div className="modal-description-body">
            <HeaderModalDescription
              dataToModal={dataToModal}
              cardFull={cardFull}
            />
            <div className="modal-description-add-description">
              <div>
                <ReorderIcon />
              </div>
              <h2>Description</h2>
            </div>
            <DescriptionBlock
              dataToModal={dataToModal}
              email={email}
              socket={socket}
              recentActivity={recentActivity}
              activData={activData}
              cardFull={cardFull}
            />
            <CheckList
              dataToModal={dataToModal}
              socket={socket}
              cardFull={cardFull}
              email={email}
            />
            <div>
              <div className="take-task">
                <div>
                  <CheckBoxOutlinedIcon />
                </div>
                <h2>Take a task</h2>
              </div>
              <CardOfTaker
                dataToModal={dataToModal}
                email={email}
                socket={socket}
                roleProfileInBoard={roleProfileInBoard}
                cardFull={cardFull}
                recentActivity={recentActivity}
                activData={activData}
              />
            </div>
            {/* Setting block */}
            <div>
              <Setting
                dataToModal={dataToModal}
                email={email}
                socket={socket}
                modalShow={modalShow}
                cardFull={cardFull}
                roleProfileInBoard={roleProfileInBoard}
              />
            </div>
            <div className="modal-description-actions-block">
              <div>
                <FormatListBulletedIcon />
              </div>

              <h2>Comments</h2>
            </div>
            <Comment
              dataToModal={dataToModal}
              email={email}
              socket={socket}
              roleProfileInBoard={roleProfileInBoard}
              cardFull={cardFull}
              recentActivity={recentActivity}
              activData={activData}
            />
            <div></div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
};

const mapStateToProps = ({
  reducerDataIdentification: { email, name },
  loginReducer: { token },
  reducerSaveData: {
    boards,
    socket,
    card,
    cardFull,
    roleProfileInBoard,
    valueDisplay,
    dataToModal,
    activData,
  },
}) => {
  return {
    token,
    name,
    boards,
    socket,
    email,
    card,
    roleProfileInBoard,
    cardFull,
    valueDisplay,
    activData,
    dataToModal,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    displaySelection: (valueDisplay) => {
      dispatch(displaySelection(valueDisplay));
    },
    saveFullCard: (cardFull) => {
      dispatch(saveFullCard(cardFull));
    },
    modalShow: (show) => {
      dispatch(modalShow(show));
    },
    saveActivityCard: (card) => {
      dispatch(saveActivityCard(card));
    },
    recentActivity: (activData) => {
      dispatch(recentActivity(activData));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDescription);
