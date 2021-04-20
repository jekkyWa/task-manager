import React, { useEffect, useState } from "react";
// files
import Header from "../../header";
import SideBar from "../../sideBar/side-bar";
import Loading from "../../loading/loading";
import "./boards-main-page.scss";
import BoardMarksItem from "../board-marks-item";
// redux
import { connect } from "react-redux";
import {
  saveDataForBoardsPage,
  markBoard,
} from "../../../action/action-save-date";
// material
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";
import BoardItem from "../board-item";

const BoardsMainPage = ({
  socket,
  email,
  saveDataForBoardsPage,
  allDataForBoardsPage,
  token,
}) => {
  const [loading, setLoading] = useState(true);

  // Connect to the room MainPageBoard
  useEffect(() => {
    if (socket) {
      socket.emit("joinMainPageBoard", { email: email });
    }
  }, [email, socket]);

  // Getting all data when downloading a page
  useEffect(() => {
    if (socket) {
      socket.on("getDataMainPageBoard", (value) => {
        saveDataForBoardsPage(value);
        setLoading(false);
      });

      return () => socket.off("getDataMainPageBoard");
    }
  }, [socket, allDataForBoardsPage]);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container boards-page">
        <div>
          <SideBar />
        </div>
        <div className="body-page-container">
          <div className="boards-page-body">
            <div className="boards-page-header">
              <StarOutlineRoundedIcon />
              <h1>Marked boards</h1>
            </div>
            <div className="boards-body">
              <BoardMarksItem
                email={email}
                token={token}
                allDataForBoardsPage={allDataForBoardsPage}
                saveDataForBoardsPage={saveDataForBoardsPage}
                url="addMarkMainBoards"
              />
            </div>
          </div>
          <div className="boards-page-body main-body-boards">
            <BoardItem
              email={email}
              token={token}
              allDataForBoardsPage={allDataForBoardsPage}
              saveDataForBoardsPage={saveDataForBoardsPage}
              url="addMarkMainBoards"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  reducerSaveData: { allDataForBoardsPage, socket },
  reducerDataIdentification: { email },
  loginReducer: { token },
}) => {
  return { socket, email, allDataForBoardsPage, token };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataForBoardsPage: (allDataForBoardsPage) => {
      dispatch(saveDataForBoardsPage(allDataForBoardsPage));
    },
    markBoard: (marksBoard) => {
      dispatch(markBoard(marksBoard));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardsMainPage);
