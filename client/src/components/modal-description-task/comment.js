import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { connect } from "react-redux";
import { recentActivity } from "../../action/action-login";

const Comment = ({
  email,
  socket,
  dataToModal,
  roleProfileInBoard,
  valueDisplay,
  recentActivity,
  activData,
}) => {
  const [commentState, setCommentState] = useState(false);

  const [comment, setComment] = useState("");

  const item = valueDisplay.valueDisp.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];

  const commentToPage = item.card_body.filter(
    (e) => dataToModal.id == e.id_task
  )[0];

  const onHandlerComment = (e) => {
    setComment(e.target.value);
  };

  const addComment = async () => {
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
    await socket.emit("addComment", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: value,
      dataActiv: {
        message: `User ${email} added a comment: "${value.text_comment}"`,
        email,
        cardName: item.card_name,
        taskName: commentToPage.title,
      },
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on("newСommentEvent", (value) => {
        console.log(value)
        recentActivity(value);
      });
      // После того как данные придут остановить дальнейшую отправку
      return () => socket.off("newСommentEvent");
    }
  }, [socket, activData]);

  const label = commentToPage.comment.map((e, i) => {
    return (
      <div
        onClick={() => {
          console.log(item);
        }}
        key={i}
        className={"comment-item"}
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

  const statusProfile = (status) => {
    return status == "Senior" ? 3 : status == "Middle" ? 2 : 1;
  };
  if (
    !(
      commentToPage.role.findIndex((e) => e.role !== roleProfileInBoard.role) ==
        -1 &&
      commentToPage.role.findIndex(
        (e) => statusProfile(e.level) <= statusProfile(roleProfileInBoard.level)
      ) !== -1
    ) ||
    roleProfileInBoard.role == "Product manager"
  ) {
    return (
      <React.Fragment>
        <div className="modal-description-comment">
          Вы не можете оставлять комментарии
        </div>
        <div className="comment-main-block">{label}</div>
      </React.Fragment>
    );
  }
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
  getDataReducer: { roleProfileInBoard, valueDisplay, activData },
}) => {
  return { token, roleProfileInBoard, valueDisplay, activData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recentActivity: (activData) => {
      dispatch(recentActivity(activData));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
