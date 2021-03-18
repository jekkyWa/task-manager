import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { saveDataCards } from "../../action/action-login";
import { connect } from "react-redux";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ReorderIcon from "@material-ui/icons/Reorder";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import "./modal-description.scss";
import { useParams } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import { useHttp } from "../hooks/http.hook";
import shortid from "shortid";

const ModalDescription = ({ show, onHide, dataToModal }) => {
  const [descriptionState, setDescriptionState] = useState(false);
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
          <div
            className={
              !descriptionState ? "modal-description-select-input" : "hidden"
            }
            onClick={() => {
              setDescriptionState(true);
            }}
          >
            <p>Добавить более подробное описание...</p>
          </div>

          <div
            className={descriptionState ? "modal-description-input" : "hidden"}
          >
            <textarea />
            <button>Сохранить</button>
            <CloseIcon
              onClick={() => {
                setDescriptionState(false);
              }}
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
          <div className="modal-description-comment">
            <input />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { active_rooms, name, boards, socket },
}) => {
  return { token, active_rooms, name, boards, socket };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataCards: (boards) => {
      dispatch(saveDataCards(boards));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDescription);
