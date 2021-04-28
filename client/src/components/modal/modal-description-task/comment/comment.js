import React, { useState, useEffect, Fragment } from "react";
import dateFormat from "dateformat";
// files
import CommentItem from "./blocks/comment-item";
import "./comment.scss";
// material
import CloseIcon from "@material-ui/icons/Close";

const Comment = ({
  email,
  socket,
  dataToModal,
  roleProfileInBoard,
  cardFull,
  recentActivity,
  activData,
}) => {
  const [commentState, setCommentState] = useState(false);
  const [comment, setComment] = useState("");

  // Filer Data
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
    setComment("");
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

  // Role check for interaction with comments
  const statusProfile = (status) => {
    return status == "Senior" ? 3 : status == "Middle" ? 2 : 1;
  };

  // If checking is passed, it is possible to post a comment
  if (
    !(
      commentToPage.role.findIndex((e) => e.role == roleProfileInBoard.role) ==
        -1 &&
      commentToPage.role.findIndex(
        (e) => statusProfile(e.level) <= statusProfile(roleProfileInBoard.level)
      ) !== -1
    ) &&
    roleProfileInBoard.role !== "Product manager"
  ) {
    return (
      <Fragment>
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
            <p>Write a comment...</p>
          </div>
          <div
            className={!commentState ? "hidden" : "modal-decription-active-add"}
          >
            <input
              placeholder="Write a comment ..."
              onChange={onHandlerComment}
              value={comment}
            />
            <div className="modal-decription-active-add-btn">
              <button onClick={addComment}>Send</button>
              <div className="close-icon-comment-block">
                <CloseIcon
                  className="modal-description-close-icon"
                  onClick={() => {
                    setCommentState(false);
                    setComment("");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="comment-main-block">
          <CommentItem commentToPage={commentToPage} />
        </div>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <div className="modal-description-comment">
        <h1>You can not leave comments</h1>
      </div>
      <CommentItem commentToPage={commentToPage} />
      <div className="comment-main-block"></div>
    </Fragment>
  );
};

export default Comment;
