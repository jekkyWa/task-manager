import React, { useEffect, useState } from "react";
// files
import Header from "../../header";
import SideBar from "../../sideBar/side-bar";
import Loading from "../../loading/loading-main/loading";
import "../boards-blocks/boards-main-page.scss";
import BoardMarksItem from "../boards-blocks/board-marks-item";
import BoardItem from "./blocks/board-item";
import { useMark } from "../utils/mark";
// redux
import { connect } from "react-redux";
import {
  saveDataForBoardsPage,
  markBoard,
} from "../../../action/action-save-date";
// material
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";
import LoadingBtn from "../../loading/loading-btn/loading-btn";

const BoardsMainPage = ({
  socket,
  email,
  saveDataForBoardsPage,
  allDataForBoardsPage,
  token,
}) => {
  const [loading, setLoading] = useState(true);
  const { loadingMark, mark } = useMark();

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
            <div
              className={
                !loadingMark && allDataForBoardsPage.marks.length == 0
                  ? ""
                  : "hidden"
              }
            >
              <h1 className="mark-recomendation">
                You can mark the boards for more convenient work.
              </h1>
            </div>
            <div className={loadingMark ? "load-mark" : "hidden"}>
              <LoadingBtn style={true} />
              <h1>Action is performed, please wait :)</h1>
            </div>
            <div className={loadingMark ? "hidden" : "boards-body"}>
              <BoardMarksItem
                email={email}
                token={token}
                dataMarksForBoardsPage={allDataForBoardsPage.marks}
                allDataForBoardsPage={allDataForBoardsPage}
                saveDataForBoardsPage={saveDataForBoardsPage}
                mark={mark}
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
              mark={mark}
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
