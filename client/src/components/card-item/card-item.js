import React, { useState } from "react";
import {
  modalShow,
  roleForNewTask,
  modalRoleShow,
} from "../../action/action-login";
import { saveDataToModal } from "../../action/action-save-date";
import { useParams } from "react-router-dom";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { connect } from "react-redux";
import shortid from "shortid";
import dateFormat from "dateformat";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";

const CardItem = ({
  socket,
  roleProfileInBoard,
  email,
  valueDisplay,
  modalShow,
  saveRole,
  saveDataToModal,
  roleForNewTask,
  modalRoleShow,
}) => {
  let { name } = useParams();
  const [arrInput, setArrInput] = useState("");
  const [handlerTitleCard, setHandlerTitleCard] = useState("");

  const { cards } = valueDisplay.valueDisp;

  const label = cards.map((e) => {
    const card_body_id = shortid.generate();

    // Sending data to the server
    const addTask = async (value) => {
      if (handlerTitleCard.length == 0) {
        return null;
      }
      let now = new Date();
      let active = {
        card_item_id: e.card_item_id,
        card_id: name,
        task: {
          title: value,
          description: "",
          id_task: card_body_id,
          role: saveRole,
          name_add: email,
          comment: [],
          nameOfTaker: "",
          state: false,
          check_letter: { list: [], availability: false },
        },
      };
      socket.emit("addTask", {
        data: active,
        dataActiv: {
          message: `User ${email} added a task "${value.title}" in a card "${e.card_name}"`,
          email,
          date: dateFormat(now, "dd-mm-yyyy, hh:MM:ss "),
        },
      });
    };

    // Displays the shape with buttons to create Task
    const addCardBlock = () => {
      setArrInput(e.card_item_id);
    };

    // Realization close btn
    const closeBtn = () => {
      setHandlerTitleCard("");
      setArrInput();
      setHandlerTitleCard("");
    };

    // Data Processing for New Card
    const onChangeTitleTaskHandler = (event) => {
      setHandlerTitleCard(event.target.value);
    };

    // Recruiling new cards
    const arrTask = e.card_body.map((element, i) => {
      const label = element.role.map((e, i) => {
        if (element.role.length !== i + 1) {
          return <span key={i}>{e.role + "-" + e.level + ", "}</span>;
        }
        return <span key={i}>{e.role + "-" + e.level}</span>;
      });
      const statusProfile = (status) => {
        return status == "Senior" ? 3 : status == "Middle" ? 2 : 1;
      };
      if (!element.state) {
        if (
          !(
            element.role.findIndex((e) => e.role !== roleProfileInBoard.role) ==
              -1 &&
            element.role.findIndex(
              (e) =>
                statusProfile(e.level) <=
                statusProfile(roleProfileInBoard.level)
            ) !== -1
          ) ||
          roleProfileInBoard.role == "Product manager"
        ) {
          return (
            <div
              className="task-item task-item-for-all"
              key={i}
              onClick={() => {
                modalShow(true);
                saveDataToModal({
                  name: element.title,
                  column: e.card_name,
                  id: element.id_task,
                  card_id: e.card_item_id,
                  board_id: name,
                  name_add: element.name_add,
                  role: element.role
                    .map((elemMap) => {
                      return elemMap.role + "-" + elemMap.level;
                    })
                    .join(" | "),
                });
              }}
            >
              <p>Title: {element.title}</p>
              <p>Role: {label}</p>
            </div>
          );
        }
        return (
          <div
            className="task-item"
            key={i}
            onClick={() => {
              saveDataToModal({
                name: element.title,
                column: e.card_name,
                id: element.id_task,
                card_id: e.card_item_id,
                board_id: name,
                name_add: element.name_add,
                role: element.role,
              });
              modalShow(true);
            }}
          >
            <p>Title: {element.title}</p>
            <p>Role: {label}</p>
            <div className="item-block-icon-state">
              <div className={!element.nameOfTaker ? "hidden" : ""}>
                <CheckCircleOutlineOutlinedIcon fontSize="small" />
              </div>
              <div className={element.description ? "" : "hidden"}>
                <DescriptionOutlinedIcon fontSize="small" />
              </div>
              <div className={element.comment.length > 0 ? "" : "hidden"}>
                <ChatBubbleOutlineOutlinedIcon fontSize="small" />{" "}
                <span>{element.comment.length}</span>
              </div>
            </div>
          </div>
        );
      }
    });

    return (
      <div key={e.card_item_id} className="card-item">
        <p>{e.card_name}</p>
        <div className="arr-task">{arrTask}</div>
        <textarea
          className={arrInput !== e.card_item_id ? "hidden" : ""}
          placeholder="Enter a title for this card"
          onChange={onChangeTitleTaskHandler}
          name={e.card_item_id}
          value={handlerTitleCard}
        />
        <p
          className={`add-card-text ${
            arrInput == e.card_item_id ? "hidden" : ""
          }`}
          onClick={() => {
            addCardBlock();
            setHandlerTitleCard("");
            roleForNewTask([]);
          }}
        >
          <AddIcon fontSize="small" />{" "}
          <span className="menu-txt">Add card</span>
        </p>
        <div
          className={
            arrInput !== e.card_item_id ? "hidden" : "add-card-btn-block"
          }
        >
          <div>
            <button
              onClick={() => {
                addTask(handlerTitleCard);
                roleForNewTask([]);
              }}
            >
              Add card
            </button>
            <CloseIcon className="close-icon" onClick={closeBtn} />
          </div>
          <MoreHorizIcon
            className="more-icon"
            onClick={() => {
              modalRoleShow(true);
            }}
          />
        </div>
      </div>
    );
  });
  return <React.Fragment>{label}</React.Fragment>;
};

const mapStateToProps = ({
  getDataReducer: { socket, roleProfileInBoard, email, valueDisplay, saveRole },
  loginReducer: { token },
}) => {
  return {
    token,
    socket,
    roleProfileInBoard,
    email,
    valueDisplay,
    saveRole,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    modalRoleShow: (roleShow) => {
      dispatch(modalRoleShow(roleShow));
    },
    modalShow: (show) => {
      dispatch(modalShow(show));
    },
    saveDataToModal: (dataToModal) => {
      dispatch(saveDataToModal(dataToModal));
    },
    roleForNewTask: (saveRole) => {
      dispatch(roleForNewTask(saveRole));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardItem);
