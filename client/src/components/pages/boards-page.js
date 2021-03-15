import React, { useState, useEffect } from "react";
import Header from "../header";
import ModalAddBoard from "../modal-add-board/modal-add-board";
import SideBar from "../sideBar/side-bar";
import "./pages.scss";
import { connect } from "react-redux";
import { saveDataCards } from "../../action/action-login";
import { useHttp } from "../hooks/http.hook";
import { Link, useParams } from "react-router-dom";
import Loading from "../loading/loading";
import io from "socket.io-client";

const BoardPage = ({ saveDataCards, token, boards }) => {
  const [modalShow, setModalShow] = useState(false);
  const { request, loading } = useHttp();
  let { id } = useParams();
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const newSocket = io("http://localhost:5000", {
      query: {
        token,
      },
    });
    console.log(newSocket);
    newSocket.on("disconnect", () => {
      setSocket(null);
      setTimeout(setupSocket, 3000);
      console.log("disconnecnt");
    });

    newSocket.on("connect", () => {
      console.log("succes");
    });

    setSocket(newSocket);
    console.log(newSocket);
  };

  useEffect(() => {
    setupSocket();
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId: id.slice(id.length - 9),
      });
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          chatroomId: id.slice(id.length - 9),
        });
      }
    };
    //eslint-disable-next-line
  }, []);

  const getDataCards = async () => {
    try {
      const value = await request(
        "/api/getBoards",
        "POST",
        { board_id: id.slice(id.length - 9) },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      saveDataCards(value.filterCards);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getDataCards();
    console.log(boards)
  }, [id]);

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

  return (
    <div>
      <Header />
      <div className="container boards-page">
        <div>
          <SideBar />
        </div>
        <div className="boards-body">
          {label}
          <div className="board" onClick={() => setModalShow(true)}>
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
  getDataReducer: { boards },
  loginReducer: { token },
}) => {
  return { token, boards };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataCards: (boards) => {
      dispatch(saveDataCards(boards));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage);
