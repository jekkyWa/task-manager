import React from "react";

const EmptyHandlerBoard = ({ labelItem }) => {
  if (labelItem.length !== 0) {
    return <div className="boards-body">{labelItem}</div>;
  }
  return (
    <div className="boards-body">
      <h1>In this team, exist "Boards"</h1>
    </div>
  );
};

export default EmptyHandlerBoard;
