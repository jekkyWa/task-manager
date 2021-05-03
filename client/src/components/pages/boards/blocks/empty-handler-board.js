import React from "react";

const EmptyHandlerBoard = ({ labelItem }) => {
  if (labelItem.length !== 0) {
    return <div className="boards-body">{labelItem}</div>;
  }
  return (
    <div className="boards-body">
      <h1>
        In this team, there are no created boards, but if you are Creator, go
        over the tab and create a new board. Or wait while it will create a team
        owner.
      </h1>
    </div>
  );
};

export default EmptyHandlerBoard;
