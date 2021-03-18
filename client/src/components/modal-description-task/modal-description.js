import React, { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { saveDataCards } from "../../action/action-login";
import { connect } from "react-redux";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ReorderIcon from "@material-ui/icons/Reorder";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import CloseIcon from "@material-ui/icons/Close";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import "./modal-description.scss";
import { useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import shortid from "shortid";

const ModalDescription = ({ show, onHide, dataToModal, email }) => {
  const [descriptionState, setDescriptionState] = useState(false);
  const ref = useRef(null);

  const [commentState, setCommentState] = useState(false);

  const focus = () => {
    ref.current.focus();
  };
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
            <p onClick={focus}>Добавить более подробное описание...</p>
          </div>

          <div
            className={descriptionState ? "modal-description-input" : "hidden"}
          >
            <textarea ref={ref} />
            <button className="modal-description-btn-save">Сохранить</button>
            <CloseIcon
              className="modal-description-close-icon"
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
            <div className="icon-profile-comment">
              <p>{email[0]}</p>
            </div>
            <div
              className={
                !commentState ? "modal-description-add-comment-btn" : "hidden"
              }
              onClick={() => {
                setCommentState(true);
              }}
            >
              <p>Напишите комментарий...</p>
            </div>
            <div
              className={
                !commentState ? "hidden" : "modal-decription-active-add"
              }
            >
              <input placeholder="Напишите комментарий..." />
              <div className="modal-decription-active-add-btn">
                <div>
                  <button>Сохранить</button>
                  <CloseIcon
                    className="modal-description-close-icon"
                    onClick={() => {
                      setCommentState(false);
                    }}
                  />
                </div>
                <div>
                  <AttachFileIcon fontSize="small" className="clip"/>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { email, name, boards, socket },
}) => {
  return { token, name, boards, socket, email };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataCards: (boards) => {
      dispatch(saveDataCards(boards));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDescription);
