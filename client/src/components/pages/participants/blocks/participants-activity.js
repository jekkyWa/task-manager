import React, { useEffect } from "react";

const ParticipantsActivity = ({ boardActive }) => {
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
