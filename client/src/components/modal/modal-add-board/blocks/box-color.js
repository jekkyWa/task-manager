import React from "react";
import DoneIcon from "@material-ui/icons/Done";

export const BoxColor = ({ style, func, value, backColor }) => {
  return (
    <div
      className={style}
      onClick={() => {
        func(value);
      }}
    >
      <DoneIcon
        fontSize="small"
        className={backColor == value ? "done-modal-add-board" : "hidden"}
      />
    </div>
  );
};
