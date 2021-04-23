import React, { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { connect } from "react-redux";
import { recentActivity } from "../../../action/action-save-date";
import dateFormat from "dateformat";

const Comment = ({
  email,
  socket,
  dataToModal,
  roleProfileInBoard,
  valueDisplay,
  cardFull,
  recentActivity,
  activData,
}) => {
  const [commentState, setCommentState] = useState(false);

  const [comment, setComment] = useState("");

  const item = cardFull.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];

  const commentToPage = item.card_body.filter(
    (e) => dataToModal.id == e.id_task
  )[0];

  const onHandlerComment = (e) => {
    setComment(e.target.value);
  };

  const addComment = async () => {
    let now = new Date();
    const value = {
      text_comment: comment,
      date: dateFormat(now, "dd-mm-yyyy, hh:MM:ss "),
      сommentatorsEmail: email,
    };
    await socket.emit("addComment", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: value,
      dataActiv: {
        message: `User ${email} added a comment: "${value.text_comment}" in card "${item.card_name}" to the "${commentToPage.title}"`,
        email,
        date: dateFormat(now, "dd-mm-yyyy, hh:MM:ss "),
      },
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on("newСommentEvent", (value) => {
        recentActivity(value);
      });
      // After the data come to stop further sending
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
        className="comment-item"
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
    (commentToPage.role.findIndex((e) => e.role !== roleProfileInBoard.role) ==
      -1 &&
      commentToPage.role.findIndex(
        (e) => statusProfile(e.level) <= statusProfile(roleProfileInBoard.level)
      ) !== -1) ||
    roleProfileInBoard.role == "Product manager"
  ) {
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
            <p>Write a comment ...</p>
          </div>
          <div
            className={!commentState ? "hidden" : "modal-decription-active-add"}
          >
            <input
              placeholder="Write a comment ..."
              onChange={onHandlerComment}
            />
            <div className="modal-decription-active-add-btn">
              <div>
                <button onClick={addComment}>Send</button>
                <CloseIcon
                  className="modal-description-close-icon"
                  onClick={() => {
                    setCommentState(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="comment-main-block">{label}</div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <div className="modal-description-comment">
        <h1>You can not leave comments</h1>
      </div>
      <div className="comment-main-block">{label}</div>
    </React.Fragment>
  );
};
const mapStateToProps = ({
  loginReducer: { token },
  reducerSaveData: { roleProfileInBoard, valueDisplay, activData, cardFull },
}) => {
  return { token, roleProfileInBoard, valueDisplay, activData, cardFull };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recentActivity: (activData) => {
      dispatch(recentActivity(activData));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
