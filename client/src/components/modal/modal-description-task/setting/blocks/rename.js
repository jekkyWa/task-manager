import React, { useState } from "react";
// material
import CloseIcon from "@material-ui/icons/Close";

const Rename = ({ renameHandler, renameBody, setRenameBody, renameFunc }) => {
  const [showCard, setShowCard] = useState(false);

  return (
    <div>
      <h1>
        Change the task. When the task is changed, if it was taken, it will not
        be canceled, but the user may refuse its execution. Do not change the
        task dramatically!
      </h1>
      <button
        className={!showCard ? "" : "hidden"}
        onClick={() => {
          setShowCard(true);
        }}
      >
        Rename
      </button>
      <div className={showCard ? "" : "hidden"}>
        <input
          onChange={renameHandler}
          value={renameBody}
          placeholder="Rename"
        />
      </div>
      <div className={showCard ? "" : "hidden"}>
        <button className="save-btn" onClick={renameFunc}>
          Save
        </button>
        <CloseIcon
          className="modal-description-close-icon-setting"
          onClick={() => {
            setShowCard(false);
            setRenameBody("");
          }}
        />
      </div>
    </div>
  );
};

export default Rename;
