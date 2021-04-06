import React, { useState, useEffect } from "react";
import Header from "../header";
import ModalAddBoard from "../modal-add-board/modal-add-board";
import SideBar from "../sideBar/side-bar";
import "./pages.scss";
import { connect } from "react-redux";
import { saveDataCards, saveRole } from "../../action/action-login";
import { Link, useParams } from "react-router-dom";
import Loading from "../loading/loading";
import { useHistory } from "react-router-dom";

const BoardPage = ({
  saveDataCards,
  boards,
  socket,
  rooms,
  email,
  saveRole,
  roleProfileInBoard,
  stateDelete,
}) => {
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  let { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const index = rooms.passive.findIndex((e) => {
      return e.board_id == id.slice(id.length - 9);
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
      socket.emit("joinroom", { id: id.slice(id.length - 9) });
    }
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getBoard", (value) => {
        saveDataCards(value.filterCards);
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
          id.slice(id.length - 9) == value.board.board_id
        ) {
          history.push("/page");
        }
      });
      return () => socket.off("getDataAfterDeleteUser");
    }
  }, [socket]);

  const label = boards.map((e) => {
    return (
      <Link
        className={`board ${e.color}`}
        to={`/boards/${id}/${e.card_id}`}
        key={e.card_id}
      >
        <div>{e.name_Board}</div>
      </Link>
    );
  });

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  if (stateDelete) {
    return <div>Вас удалили из команды</div>;
  }

  return (
    <div>
      <Header />
      <div className="container boards-page">
        <div>
          <SideBar />
        </div>
        <div className="boards-body">
          {label}
          <div
            className={`${
              roleProfileInBoard.role == "Product manager" ? "board" : "hidden"
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage);
