import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
// files
import Header from "../../header";
import ModalAddBoard from "../../modal/modal-add-board/modal-add-board";
import SideBar from "../../sideBar/side-bar";
import "../pages.scss";
import "../boards-blocks/boards-main-page.scss";
import Loading from "../../loading/loading";
import BoardMarkItem from "../boards-blocks/board-marks-item";
import BoardInCommandItem from "./blocks/board-in-command-item";
// redux
import { connect } from "react-redux";
import {
  saveDataCards,
  saveRole,
  markBoard,
} from "../../../action/action-save-date";
// material
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";

const BoardPage = ({
  saveDataCards,
  boards,
  socket,
  rooms,
  email,
  saveRole,
  roleProfileInBoard,
  token,
  markBoard,
  marksBoard,
}) => {
  // router
  const history = useHistory();
  let { id } = useParams();

  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const index = rooms.passive.findIndex((e) => {
      return e.board_id == id.slice(id.length - 10);
    });
    if (index !== -1) {
      const profileIndex = rooms.passive[index].addedUsers.findIndex(
        (e) => e.email == email
      );
      const role = {
        role: rooms.passive[index].addedUsers[profileIndex].role,
        level: rooms.passive[index].addedUsers[profileIndex].level,
      };
      saveRole(role);
    } else {
      saveRole({ role: "Product manager", level: "god" });
    }
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinroom", { id: id.slice(id.length - 10), email });
      return () => socket.emit("leaveRoom", { id: id.slice(id.length - 10) });
    }
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getBoard", (value) => {
        saveDataCards(value.filterCards);
        markBoard(value.marksCards);
        console.log(value.marksCards);
        setLoading(false);
      });
    }
  }, [id, socket]);

  // обновление всех элементов при удалении пользователя
  useEffect(() => {
    if (socket) {
      socket.on("getDataAfterDeleteUser", (value) => {
        if (
          value.board.addedUsers.findIndex((e) => e.email == email) == -1 &&
          email !== value.board.creator &&
          id.slice(id.length - 10) == value.board.board_id
        ) {
          history.push("/page");
        }
      });
      return () => socket.off("getDataAfterDeleteUser");
    }
  }, [socket]);

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
            <div className={marksBoard.length == 0 ? "hidden" : "boards-body"}>
              <BoardMarkItem
                email={email}
                token={token}
                allDataForBoardsPage={marksBoard}
                saveDataForBoardsPage={markBoard}
                url="addMark"
              />
            </div>
            <div className={marksBoard.length !== 0 ? "hidden" : ""}>
              <h1 className="mark-recomendation">
                You can mark the boards for more convenient work.
              </h1>
            </div>
          </div>
          <div className="boards-page-body main-body-boards">
            <div className="boards-page-header">
              <PersonOutlineOutlinedIcon />
              <h1>Your workspace boards</h1>
            </div>
            <div className="boards-body">
              <BoardInCommandItem
                email={email}
                token={token}
                allDataForBoardsPageBoards={boards}
                allDataForBoardsPageMarks={marksBoard}
                saveDataForBoardsPage={markBoard}
                url="addMark"
              />
              <div
                className={`${
                  roleProfileInBoard.role == "Product manager"
                    ? "board"
                    : "hidden"
                }`}
                onClick={() => setModalShow(true)}
              >
                <p>Create a board</p>
              </div>
              <ModalAddBoard
                show={modalShow}
                onHide={() => setModalShow(false)}
                socket={socket}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  reducerSaveData: { boards, socket, roleProfileInBoard, marksBoard },
  reducerState: { stateDelete },
  reducerDataIdentification: { email, rooms },
  loginReducer: { token },
}) => {
  return {
    token,
    boards,
    socket,
    rooms,
    email,
    roleProfileInBoard,
    stateDelete,
    marksBoard,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveRole: (roleProfileInBoard) => {
      dispatch(saveRole(roleProfileInBoard));
    },
    saveDataCards: (boards) => {
      dispatch(saveDataCards(boards));
    },
    markBoard: (marksBoard) => {
      dispatch(markBoard(marksBoard));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage);
