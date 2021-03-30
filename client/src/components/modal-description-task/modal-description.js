import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import {
  saveActivityCard,
  modalShow,
  saveFullCard,
  displaySelection,
} from "../../action/action-login";
import { connect } from "react-redux";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ReorderIcon from "@material-ui/icons/Reorder";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import "./modal-description.scss";
import DescriptionBlock from "./description-block";
import { availCheck } from "../hooks/availability-check.hook";
import CardOfTaker from "./card-of-taker";
import Comment from "./comment";
import Setting from "./setting";

// -----------------------------------------------------

const ModalDescription = ({
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
}) => {
  const [idDel, setIdDel] = useState("");

  // Change name
  useEffect(() => {
    if (socket) {
      socket.on("getRenameData", (value) => {
        console.log(value);
        if (dataToModal) {
          const item = value.cards.filter(
            (e) => e.card_item_id == dataToModal.card_id
          )[0];
          saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
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
          saveFullCard(newItem);
          if (!valueDisplay.stateFilter) {
            displaySelection({ valueDisp: newItem, stateFilter: false });
          } else {
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
      });

      return () => socket.off("getRenameData");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Adding a description of the task
  useEffect(() => {
    if (socket) {
      socket.on("newDescriptionTask", (value) => {
        if (dataToModal) {
          const item = value.cards.filter(
            (e) => e.card_item_id == dataToModal.card_id
          )[0];
          saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
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
          saveFullCard(newItem);
          if (!valueDisplay.stateFilter) {
            displaySelection({ valueDisp: newItem, stateFilter: false });
          } else {
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
      });

      return () => socket.off("newDescriptionTask");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Propulation Task for the user
  useEffect(() => {
    if (socket) {
      socket.on("newUserToDo", (value) => {
        if (dataToModal) {
          const item = value.cards.filter(
            (e) => e.card_item_id == dataToModal.card_id
          )[0];
          saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
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
          saveFullCard(newItem);
          if (!valueDisplay.stateFilter) {
            displaySelection({ valueDisp: newItem, stateFilter: false });
          } else {
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
      });

      return () => socket.off("newUserToDo");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Additional comment
  useEffect(() => {
    if (socket) {
      socket.on("newComment", (value) => {
        console.log(value);
        if (dataToModal) {
          const item = value.cards.filter(
            (e) => e.card_item_id == dataToModal.card_id
          )[0];
          saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
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
          saveFullCard(newItem);
          if (!valueDisplay.stateFilter) {
            displaySelection({ valueDisp: newItem, stateFilter: false });
          } else {
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
      });

      return () => socket.off("newComment");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Refusal of the task
  useEffect(() => {
    if (socket) {
      socket.on("getRefuseAssignment", (value) => {
        if (dataToModal) {
          const item = value.cards.filter(
            (e) => e.card_item_id == dataToModal.card_id
          )[0];
          saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
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
          saveFullCard(newItem);
          if (!valueDisplay.stateFilter) {
            displaySelection({ valueDisp: newItem, stateFilter: false });
          } else {
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
      });

      return () => socket.off("getRefuseAssignment");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Update status in the database If the tasks are executed
  useEffect(() => {
    if (socket) {
      socket.on("updateStateComplit", (value) => {
        if (dataToModal) {
          console.log(dataToModal);
          const item = value.cards.filter(
            (e) => e.card_item_id == dataToModal.card_id
          )[0];
          console.log(item);
          saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
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
          saveFullCard(newItem);
          if (!valueDisplay.stateFilter) {
            displaySelection({ valueDisp: newItem, stateFilter: false });
          } else {
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
      });
      // After the data come to stop further sending
      return () => socket.off("updateStateComplit");
    }
  }, [socket, valueDisplay, dataToModal]);

  // Delete task
  useEffect(() => {
    if (socket) {
      socket.on("getDataAfterDelete", (value) => {
        if (dataToModal) {
          setIdDel(value.id);
          saveActivityCard({
            ...availCheck(
              value.body,
              valueDisplay.valueDisp,
              roleProfileInBoard
            ),
          });
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
          saveFullCard(newItem);
          if (!valueDisplay.stateFilter) {
            displaySelection({ valueDisp: newItem, stateFilter: false });
          } else {
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
        dialogClassName="modal-50w"
        show={show}
        onHide={() => {
          modalShow(false);
        }}
      >
        <Modal.Body>Пользователь удалил это задание</Modal.Body>
      </Modal>
    );
  } else {
    return (
      <Modal
        dialogClassName="modal-50w"
        show={show}
        onHide={() => {
          modalShow(false);
        }}
      >
        <Modal.Body>
          <div className="modal-description-body">
            <div className="modal-description-header-block-one">
              <div>
                <ListAltIcon />
              </div>
              <div
                onClick={() => {
                  console.log(dataToModal);
                }}
              >
                <h2>{dataToModal.name}</h2>
              </div>
            </div>
            <p>In a collumn "{dataToModal.column}"</p>
            <div className="modal-description-add-description">
              <div>
                <ReorderIcon />
              </div>
              <div>
                <h2>Description</h2>
              </div>
            </div>
            <DescriptionBlock
              dataToModal={dataToModal}
              email={email}
              socket={socket}
            />
            <div>
              <div className="take-task">
                <div>
                  <CheckBoxOutlinedIcon />
                </div>
                <div>
                  <h2>Take a task</h2>
                </div>
              </div>
              <CardOfTaker
                dataToModal={dataToModal}
                email={email}
                socket={socket}
              />
            </div>
            {/* Setting */}
            <Setting dataToModal={dataToModal} email={email} socket={socket} />
            <div className="modal-description-actions-block">
              <div className="modal-description-actions">
                <div>
                  <FormatListBulletedIcon />
                </div>
                <div>
                  <h2>Comments</h2>
                </div>
              </div>
              <button>Показать детали</button>
            </div>
            <Comment dataToModal={dataToModal} email={email} socket={socket} />
            <div></div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: {
    email,
    name,
    boards,
    socket,
    card,
    cardFull,
    roleProfileInBoard,
    valueDisplay,
    dataToModal,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDescription);
