import React, { useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { connect } from "react-redux";

const Comment = ({ email, socket, dataToModal, card }) => {
  const [commentState, setCommentState] = useState(false);

  const [comment, setComment] = useState("");

  const onHandlerComment = (e) => {
    setComment(e.target.value);
  };

  const addComment = () => {
    const date = new Date();
    const value = {
      text_comment: comment,
      date:
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2),
      сommentatorsEmail: email,
    };
    socket.emit("addComment", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: value,
    });
  };

  const commentToPage = card.cards
    .filter((e) => e.card_item_id == dataToModal.card_id)[0]
    .card_body.filter((e) => dataToModal.id == e.id_task)[0];

  const label = commentToPage.comment.map((e, i) => {
    return (
      <div
        key={i}
        className={
          e.сommentatorsEmail == email ? "comment-item" : "comment-item"
        }
      >
        <div className="icon-profile-comment">
          <p> {e.сommentatorsEmail[0]}</p>
        </div>
        <div className="сommentators-info">
          <div className="сommentators-info-item">
            <p>{e.сommentatorsEmail}</p>
            <p>{e.date}</p>
          </div>
          <div className="comment-text">
            <p>{e.text_comment}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <div className="modal-description-comment">
        <div className="icon-profile-comment">
          <p>{email[0].toUpperCase()}</p>
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
          className={!commentState ? "hidden" : "modal-decription-active-add"}
        >
          <input
            placeholder="Напишите комментарий..."
            onChange={onHandlerComment}
          />
          <div className="modal-decription-active-add-btn">
            <div>
              <button onClick={addComment}>Отправить</button>
              <CloseIcon
                className="modal-description-close-icon"
                onClick={() => {
                  setCommentState(false);
                }}
              />
            </div>
            <div>
              <AttachFileIcon fontSize="small" className="clip" />
            </div>
          </div>
        </div>
      </div>
      <div className="comment-main-block">{label}</div>
    </React.Fragment>
  );
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { card },
}) => {
  return { token, card };
};

export default connect(mapStateToProps, null)(Comment);
