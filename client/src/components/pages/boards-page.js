import React, { useState, useEffect } from "react";
import Header from "../header";
import ModalAddBoard from "../modal-add-board/modal-add-board";
import SideBar from "../sideBar/side-bar";
import "./pages.scss";
import { connect } from "react-redux";
import { saveDataCards, saveRole, markBoard } from "../../action/action-login";
import { Link, useParams } from "react-router-dom";
import Loading from "../loading/loading";
import { useHistory } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import { useHttp } from "../hooks/http.hook";
import StarOutlineRoundedIcon from '@material-ui/icons/StarOutlineRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';


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
  const { request } = useHttp();

  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  let { id } = useParams();
  const test = useParams();
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
    }
    return () => socket.emit("leaveRoom", { id: id.slice(id.length - 10) });
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getBoard", (value) => {
        saveDataCards(value.filterCards);
        console.log(value.marksCards);
        markBoard(value.marksCards);
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

  const labelMarks = marksBoard.map((e, i) => {
    const mark = async (bool) => {
      const board_id = id.slice(id.length - 10);
      const newMarkBoard = e.card_id;
      const value = { board_id, email, newMarkBoard, state: bool };
      const data = await request("/api/addMark", "POST", value, {
        Authorization: `Bearer ${token}`,
      });
      markBoard(data.marksCards);
    };
    return (
      <div className={`board ${e.color}`} key={e.card_id}>
        <div>
          <Link to={`/boards/${id}/${e.card_id}`}>
            <div className="main-link-boards">{e.name_Board}</div>
          </Link>
        </div>
        <div
          className="star-icon-boards-page"
          onClick={() => {
            mark(false);
          }}
        >
          <h1>Take a label</h1>
          <StarRoundedIcon fontSize="small" />
        </div>
      </div>
    );
  });

  const label = boards.map((e) => {
    const mark = async (bool) => {
      const board_id = id.slice(id.length - 10);
      const newMarkBoard = e.card_id;
      const value = { board_id, email, newMarkBoard, state: bool };
      const data = await request("/api/addMark", "POST", value, {
        Authorization: `Bearer ${token}`,
      });
      markBoard(data.marksCards);
    };
    return (
      <div className={`board ${e.color}`} key={e.card_id}>
        <div>
          <Link to={`/boards/${id}/${e.card_id}`}>
            <div className="main-link-boards">{e.name_Board}</div>
          </Link>
        </div>

        <div
          className={
            marksBoard.findIndex((element) => element.card_id == e.card_id) !==
            -1
              ? "hidden"
              : "star-icon-boards-page"
          }
          onClick={() => {
            mark(true);
          }}
        >
          <h1>Mark</h1>
          <StarOutlineRoundedIcon fontSize="small" />
        </div>
        <div
          className={
            marksBoard.findIndex((element) => element.card_id == e.card_id) ==
            -1
              ? "hidden"
              : "star-icon-boards-page"
          }
          onClick={() => {
            mark(false);
          }}
        >
          <h1>Take a label</h1>
          <StarRoundedIcon fontSize="small" />
        </div>
      </div>
    );
  });

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
              {labelMarks}
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
              {label}
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
  getDataReducer: {
    boards,
    socket,
    rooms,
    email,
    roleProfileInBoard,
    stateDelete,
    marksBoard,
  },
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
