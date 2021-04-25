import React from "react";

const CommentItem = ({ commentToPage }) => {
  const label = commentToPage.comment.map((e, i) => {
    return (
      <div key={i} className="comment-item">
        <div className="icon-profile-comment">
          <p> {e.сommentatorsEmail[0]}</p>
        </div>
        <div className="сommentators-info">
          <div className="сommentators-info-item">
            <p>{e.сommentatorsEmail}</p>
          </div>
          <div className="comment-text">
            <p>{e.text_comment}</p>
          </div>
          <div className="date-comment">
            <p>{e.date}</p>
          </div>
        </div>
      </div>
    );
  });
  return label;
};

export default CommentItem;
