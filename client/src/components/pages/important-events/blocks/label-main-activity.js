import React from "react";

const LabelMainActivity = ({ importantEvents }) => {
  const labelMainActivity = importantEvents.board[0].boards_activity.map(
    (e, i) => {
      return (
        <div key={i} className="board-activity-important-events">
          <h1>{e.message}</h1>
          <h2>{e.date}</h2>
        </div>
      );
    }
  );
  return labelMainActivity;
};

export default LabelMainActivity;
