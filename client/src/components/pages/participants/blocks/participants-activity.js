import React from "react";

const ParticipantsActivity = ({ boardActive }) => {
  if (boardActive.boards_activity.length == 0) {
    return (
      <div className="activity-block">
        <h1>There is not a single activity</h1>
      </div>
    );
  }
  const labelActivity = boardActive.boards_activity.map((e, i) => {
    return (
      <div className="activity-block" key={i}>
        <div className="activity-block-icon">
          <p>{e.email[0].toUpperCase()}</p>
        </div>
        <p>{e.message}</p>
      </div>
    );
  });
  return labelActivity;
};

export default ParticipantsActivity;
