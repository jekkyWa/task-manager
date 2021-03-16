import React, { useState, useEffect, useMemo } from "react";
import Header from "../header";
import ModalAddBoard from "../modal-add-board/modal-add-board";
import SideBar from "../sideBar/side-bar";
import "./pages.scss";
import { connect } from "react-redux";
import { saveDataCards } from "../../action/action-login";
import { useHttp } from "../hooks/http.hook";
import { Link, useParams } from "react-router-dom";
import Loading from "../loading/loading";

const BoardPage = ({ saveDataCards, token, boards, socket }) => {
  const [modalShow, setModalShow] = useState(false);
  const { request } = useHttp();
  let { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (socket) {
      socket.emit("joinroom", { id: id.slice(id.length - 9) });
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          id: id.slice(id.length - 9),
        });
      }
    };
    //eslint-disable-next-line
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getBoard", (value) => {
        saveDataCards(value.filterCards);
      setLoading(false)
      });
    }
  }, [id, socket]);

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
  getDataReducer: { boards, socket },
  loginReducer: { token },
}) => {
  return { token, boards, socket };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataCards: (boards) => {
      dispatch(saveDataCards(boards));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardPage);
