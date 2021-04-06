import React, { useEffect, useState } from "react";
import Header from "../header";
import SideBar from "../sideBar/side-bar";
import { useParams } from "react-router-dom";
import { saveDataCards, saveActiveBoard } from "../../action/action-login";
import { connect } from "react-redux";
import "./participants.scss";
import CloseIcon from "@material-ui/icons/Close";
import ModalConfirmation from "../modal-confirmation/modal-confirmation";
import Loading from "../loading/loading";
import { useHistory } from "react-router-dom";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SettingsIcon from "@material-ui/icons/Settings";
import DoneIcon from "@material-ui/icons/Done";

const Participants = ({ socket, saveActiveBoard, email, boardActive }) => {
  const history = useHistory();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showInputAdd, setShowInputAdd] = useState(false);
  const [emailState, setEmailState] = useState("");
  const [roleState, setRoleState] = useState({
    role: "Back-end developer",
    level: "Junior",
  });
  const [dataForDelete, setDataForDelete] = useState({ id: "", email: "" });

  const [modalShow, setModalShow] = useState(false);

  const [selectRoleState, setSelectRoleState] = useState("");

  const [dataSelectUpdateRole, setDataSelectUpdateRole] = useState(
    "Back-end developer"
  );

  // Saving data to change the role
  const onRoleUpdateHandler = (e) => {
    setDataSelectUpdateRole(e.target.value);
  };

  // Saving data about email new user
  const onEmailHandler = (e) => {
    setEmailState(e.target.value);
  };

  // Roles for adding a new user
  const onRoleHandler = (e) => {
    setRoleState({ ...roleState, [e.target.name]: e.target.value });
  };

  const addNewUserToBoard = () => {
    socket.emit("addAdditionalUser", {
      board_id: id.slice(id.length - 9),
      data: { email: emailState, ...roleState },
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on("getNewUsers", (value) => {
        saveActiveBoard(value);
      });
      // After the data come to stop further sending
      return () => socket.off("getNewUsers");
    }
  }, [socket, boardActive]);

  useEffect(() => {
    if (socket) {
      socket.on("getUpdateRoleInCommand", (value) => {
        saveActiveBoard(value.board);
      });
      // After the data come to stop further sending
      return () => socket.off("getUpdateRoleInCommand");
    }
  }, [socket, boardActive]);

  useEffect(() => {
    if (socket) {
      socket.on("getUpdateLevelInCommand", (value) => {
        saveActiveBoard(value.board);
      });
      // After the data come to stop further sending
      return () => socket.off("getUpdateLevelInCommand");
    }
  }, [socket, boardActive]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinParticipants", { id: id.slice(id.length - 9) });
    }
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getRightBoard", (value) => {
        saveActiveBoard(value);
        setLoading(false);
      });
    }
  }, [id, socket]);

  // Обновление всех элементов при удалении пользователя
  useEffect(() => {
    if (socket) {
      socket.on("getDataAfterDeleteUser", (value) => {
        if (
          value.board.addedUsers.findIndex((e) => e.email == email) == -1 &&
          email !== value.board.creator &&
          id.slice(id.length - 9) == value.board.board_id
        ) {
          history.push("/page");
        } else {
          saveActiveBoard(value.board);
        }
      });
      return () => socket.off("getDataAfterDeleteUser");
    }
  }, [socket, boardActive]);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  const label = boardActive.addedUsers.map((e, i) => {
    const addSelectForm = () => {
      setSelectRoleState(e.email);
    };
    const updateUserRole = async () => {
      socket.emit("updateRoleInCommand", {
        id: id.slice(id.length - 9),
        email: e.email,
        data: dataSelectUpdateRole,
      });
    };
    const updateUserLevel = async (value) => {
      const levelArr = ["Junior", "Middle", "Senior"];
      const index = levelArr.indexOf(e.level);
      socket.emit("updateLevelInCommand", {
        id: id.slice(id.length - 9),
        email: e.email,
        movement: value,
        currentState: index,
      });
    };
    return (
      <div key={i} className="user-block-partic">
        <div className="user-item-partic">
          <div className="user-profile-icon-partic">
            <p>{e.email[0].toUpperCase()}</p>
          </div>
          <div className="info-user-partic">
            <p>Email: {e.email}</p>
            <p className={selectRoleState !== e.email ? "" : "hidden"}>
              Role:{e.role}{" "}
              <SettingsIcon
                className="setting-icon-partic"
                onClick={() => {
                  addSelectForm();
                }}
                fontSize="small"
              />
            </p>
            <div
              className={
                selectRoleState == e.email ? "select-partic" : "hidden"
              }
            >
              <select onChange={onRoleUpdateHandler} name="role">
                <option>Back-end developer</option>
                <option>Front-end developer</option>
                <option>QA</option>
                <option>Business Analyst</option>
                <option>UX/UI designer</option>
                <option>Marketing specialist</option>
                <option>Product manager</option>
              </select>
              <CloseIcon
                className="panel-icon-partic"
                onClick={() => {
                  setSelectRoleState(false);
                }}
                fontSize="small"
              />
              <DoneIcon
                onClick={() => {
                  updateUserRole();
                  setSelectRoleState(false);
                }}
                className="panel-icon-partic"
                fontSize="small"
              />
            </div>
            <p>
              Level: {e.level}
              <ExpandLessIcon
                fontSize="small"
                onClick={() => {
                  updateUserLevel("up");
                }}
              />
              <ExpandMoreIcon
                fontSize="small"
                onClick={() => {
                  updateUserLevel("down");
                }}
              />
            </p>
          </div>
        </div>
        <div
          className={
            email == boardActive.creator ? "actions-with-users" : "hidden"
          }
        >
          <button
            className="delete-user-partic"
            onClick={() => {
              setModalShow(true);
              setDataForDelete({ id: id.slice(id.length - 9), email: e.email });
            }}
          >
            Delete the user
          </button>
        </div>
      </div>
    );
  });

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
          <h1>Command: {id.slice(0, id.length - id.length - 9)}</h1>
          <h2>Team organizer: {boardActive.creator}</h2>
          <div>{label}</div>
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
          <div className={showInputAdd ? "" : "hidden"}>
            <div className="add-user-email-partic">
              <p>Email</p>
              <input onChange={onEmailHandler} />
            </div>
            <div className="add-user-role-partic">
              <p>Role in the project</p>
              <select name="role" onChange={onRoleHandler}>
                <option>Back-end developer</option>
                <option>Front-end developer</option>
                <option>QA</option>
                <option>Business Analyst</option>
                <option>UX/UI designer</option>
                <option>Marketing specialist</option>
                <option>Product manager</option>
              </select>
            </div>
            <div className="add-user-role-partic">
              <p>Level</p>
              <select name="level" onChange={onRoleHandler}>
                <option>Junior</option>
                <option>Middle</option>
                <option>Senior</option>
              </select>
            </div>
            <div className="add-user-partic-active">
              <button
                onClick={() => {
                  addNewUserToBoard();
                  setShowInputAdd(false);
                }}
              >
                Add user
              </button>
              <div
                className="close-icon-partic"
                onClick={() => {
                  setShowInputAdd(false);
                }}
              >
                <CloseIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: { socket, rooms, boardActive, email },
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
