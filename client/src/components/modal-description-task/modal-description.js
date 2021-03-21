import React, { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { saveActivityCard } from "../../action/action-login";
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

// -----------------------------------------------------

const ModalDescription = ({
  show,
  onHide,
  dataToModal,
  email,
  socket,
  card,
  saveActivityCard,
  roleProfileInBoard,
}) => {
  // добавление описания к заданию
  useEffect(() => {
    if (socket) {
      socket.on("newDescriptionTask", (value) => {
        if (dataToModal) {
          const item = value.cards.filter(
            (e) => e.card_item_id == dataToModal.card_id
          )[0];
          saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
        }
      });

      return () => socket.off("newDescriptionTask");
    }
  }, [socket, card, dataToModal]);

  // закрпеление задание за пользователем
  useEffect(() => {
    if (socket) {
      socket.on("newUserToDo", (value) => {
        if (dataToModal) {
          console.log(value);
          const item = value.cards.filter(
            (e) => e.card_item_id == dataToModal.card_id
          )[0];
          saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
        }
      });

      return () => socket.off("newUserToDo");
    }
  }, [socket, card, dataToModal]);

  // Добавеление комментария
  useEffect(() => {
    if (socket) {
      socket.on("newComment", (value) => {
        if (dataToModal) {
          console.log(value);
          const item = value.cards.filter(
            (e) => e.card_item_id == dataToModal.card_id
          )[0];
          saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
        }
      });

      return () => socket.off("newComment");
    }
  }, [socket, card, dataToModal]);

  return (
    <Modal
      dialogClassName="modal-50w"
      show={show}
      onHide={() => {
        onHide();
      }}
    >
      <Modal.Body>
        <div className="modal-description-body">
          <div className="modal-description-header-block-one">
            <div>
              <ListAltIcon />
            </div>
            <div>
              <h2>{dataToModal.name}</h2>
            </div>
          </div>
          <p>В колонке {dataToModal.column}</p>
          <div className="modal-description-add-description">
            <div>
              <ReorderIcon />
            </div>
            <div>
              <h2>Описание</h2>
            </div>
          </div>
          {/* Отображение описания по ролям */}
          <DescriptionBlock
            dataToModal={dataToModal}
            email={email}
            socket={socket}
          />
          {/* Отображение состояния задания */}

          <div>
            <div className="take-task">
              <div>
                <CheckBoxOutlinedIcon />
              </div>
              <div>
                <h2>Взять задание</h2>
              </div>
            </div>
            <CardOfTaker
              dataToModal={dataToModal}
              email={email}
              socket={socket}
            />
          </div>
          <div className="modal-description-actions-block">
            <div className="modal-description-actions">
              <div>
                <FormatListBulletedIcon />
              </div>
              <div>
                <h2>Дейстия</h2>
              </div>
            </div>
            <button>Показать подробнее</button>
          </div>
          <Comment dataToModal={dataToModal} email={email} socket={socket} />
          <div></div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { email, name, boards, socket, card, roleProfileInBoard },
}) => {
  return { token, name, boards, socket, email, card, roleProfileInBoard };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveActivityCard: (card) => {
      dispatch(saveActivityCard(card));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDescription);
