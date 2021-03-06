import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
// files
import Header from "../../header";
import SideBar from "../../sideBar/side-bar";
import "./participants.scss";
import ModalConfirmation from "../../modal/modal-confirmation/modal-confirmation";
import Loading from "../../loading/loading-main/loading";
// redux
import {
  saveDataCards,
  saveActiveBoard,
} from "../../../action/action-save-date";
import { connect } from "react-redux";
// material
import ParticipantsItem from "./blocks/participants-item";
import ParticipantsActivity from "./blocks/participants-activity";
import AddUserBlock from "./blocks/add-user-block";

const Participants = ({ socket, saveActiveBoard, email, boardActive }) => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showInputAdd, setShowInputAdd] = useState(false);
  const [valid, setValid] = useState(false);
  const [dataForDelete, setDataForDelete] = useState({ id: "", email: "" });
  const [modalShow, setModalShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("getNewUsers", (value) => {
        if (value.error) {
          return setError(value.error);
        }
        setValid(true);
        saveActiveBoard(value);
        // After the data come to stop further sending
        return () => socket.off("getNewUsers");
      });
    }
  }, [socket, boardActive]);

  useEffect(() => {
    if (socket) {
      socket.on("getUsersAfterExit", (value) => {
        saveActiveBoard(value);
      });
      return () => socket.off("getUsersAfterExit");
    }
  }, [socket, boardActive]);

  useEffect(() => {
    if (socket) {
      socket.on("getBoardWithNewUser", (value) => {
        saveActiveBoard(value);
        // After the data come to stop further sending
        return () => socket.off("getBoardWithNewUser");
      });
    }
  }, [socket, boardActive]);

  useEffect(() => {
    if (socket) {
      socket.on("getUpdateRoleInCommand", (value) => {
        saveActiveBoard(value.board);
        // After the data come to stop further sending
        return () => socket.off("getUpdateRoleInCommand");
      });
    }
  }, [socket, boardActive]);

  useEffect(() => {
    if (socket) {
      socket.on("getUpdateLevelInCommand", (value) => {
        saveActiveBoard(value.board);
        return () => socket.off("getUpdateLevelInCommand");
      });
      // After the data come to stop further sending
    }
  }, [socket, boardActive]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinParticipants", { id: id.slice(id.length - 10) });
      return () =>
        socket.emit("leaveParticipants", { id: id.slice(id.length - 10) });
    }
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getRightBoard", (value) => {
        saveActiveBoard(value);
        if (value) {
          setLoading(false);
        } else {
          throw new Error("This project was removed");
        }
      });
    }
  }, [id, socket]);

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
      <div className="container participants-page">
        <div>
          <SideBar />
        </div>
        <div className="participants">
          <ModalConfirmation
            show={modalShow}
            onHide={() => setModalShow(false)}
            dataForDelete={dataForDelete}
          />
          <h1>Command: {id.slice(0, id.length - id.length - 10)}</h1>
          <h2>Team organizer: {boardActive.creator}</h2>
          <h2>Description: {boardActive.description}</h2>
          <h2>Expiration date: {boardActive.date}</h2>
          <div>
            <ParticipantsItem
              boardActive={boardActive}
              socket={socket}
              id={id}
              email={email}
              setDataForDelete={setDataForDelete}
              setModalShow={setModalShow}
            />
          </div>
          <div className={boardActive.addedUsers.length == 0 ? "" : "hidden"}>
            <p>You did not add a single user to the team</p>
          </div>
          <div
            className={
              email == boardActive.creator ? "actions-with-users" : "hidden"
            }
          >
            <button
              className={!showInputAdd ? "add-user-partic" : "hidden"}
              onClick={() => {
                setShowInputAdd(true);
              }}
            >
              Add user
            </button>
          </div>
          <AddUserBlock
            id={id}
            email={email}
            socket={socket}
            error={error}
            showInputAdd={showInputAdd}
            setShowInputAdd={setShowInputAdd}
            setError={setError}
            valid={valid}
          />
        </div>
        <div className="activity-boards-participants">
          <h1>Recent actions</h1>
          <ParticipantsActivity boardActive={boardActive} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  reducerSaveData: { boardActive, socket },
  reducerDataIdentification: { email, rooms },
  loginReducer: { token },
}) => {
  return { token, socket, rooms, boardActive, email };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveActiveBoard: (boardActive) => {
      dispatch(saveActiveBoard(boardActive));
    },
    saveDataCards: (boards) => {
      dispatch(saveDataCards(boards));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Participants);
