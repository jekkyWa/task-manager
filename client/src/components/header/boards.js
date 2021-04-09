import React from "react";
import "./boards.scss";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import { showBoards } from "../../action/action-login";
import { connect } from "react-redux";

const BoardsBlock = ({ showBoards }) => {
  return (
    <div className="boards-block">
      <div className="boards-block-header">
        <input placeholder="Найти доску" />
        <div className="boards-block-header-close">
          <CloseIcon
            className="close-boards-block"
            fontSize="small"
            onClick={() => {
              showBoards(false);
            }}
          />
        </div>
      </div>
      <div className="boards-block-body">
        <div className="named-boards-block">
          <h1>Отмеченные доски</h1>
          <AddIcon fontSize="small" />
        </div>
        <div className="named-boards-block">
          <h1>11</h1>
          <AddIcon fontSize="small" />
        </div>
        <div className="named-boards-block">
          <h1>22</h1>
          <AddIcon fontSize="small" />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ getDataReducer: { showBoard } }) => {
  return { showBoard };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showBoards: (showBoard) => {
      dispatch(showBoards(showBoard));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardsBlock);
