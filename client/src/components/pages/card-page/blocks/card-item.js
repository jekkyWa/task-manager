import React, { useState } from "react";
import { useParams } from "react-router-dom";
import shortid from "shortid";
import dateFormat from "dateformat";
// files
import "../card-page.scss";
import WarningTooltipCustom from "./warningTooltipCustom";
// redux
import {
  modalShow,
  modalRoleShow,
  roleHandler,
} from "../../../../action/action-modal";
import {
  saveDataToModal,
  roleForNewTask,
} from "../../../../action/action-save-date";
import { connect } from "react-redux";
// material
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import ListAltIcon from "@material-ui/icons/ListAlt";

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
  showMenuFunc,
  showNotifications,
  showUserBlock,
  setStateList,
  setArrInput,
  arrInput,
  roleHandler,
}) => {
  let { name } = useParams();
  const [handlerTitleCard, setHandlerTitleCard] = useState("");

  const { cards } = valueDisplay.valueDisp;

  // Close all unnecessary activity on the page
  const closeAllWindows = () => {
    setStateList(false);
    showNotifications(false);
    showUserBlock(false);
    showMenuFunc(false);
  };

  const label = cards.map((e) => {
    const card_body_id = shortid.generate();

    // Sending data to the server
    const addTask = async (value) => {
      if (handlerTitleCard.length == 0) {
        return null;
      }
      roleHandler([]);
      setHandlerTitleCard("");
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
          message: `User ${email} added a task "${value}" in a card "${e.card_name}"`,
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
      // Finished leaf subds
      const compliteListItem = element.check_letter.list.filter((e) => e.status)
        .length;
      // All created subtasks
      const fullCountListItem = element.check_letter.list.length;
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
          ) &&
          roleProfileInBoard.role !== "Product manager"
        ) {
          return (
            <div
              className="task-item task-item-for-all"
              key={i}
              onClick={() => {
                closeAllWindows();
                modalShow(true);
                saveDataToModal({
                  name: element.title,
                  column: e.card_name,
                  id: element.id_task,
                  card_id: e.card_item_id,
                  board_id: name,
                  name_add: element.name_add,
                  name_take: element.nameOfTaker,
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
                name_take: element.nameOfTaker,
                role: element.role,
              });
              modalShow(true);
              closeAllWindows();
            }}
          >
            <p>Title: {element.title}</p>
            <p>Role: {label}</p>
            <div className="item-block-icon-state">
              <div className={!element.nameOfTaker ? "hidden" : ""}>
                <CheckCircleOutlineOutlinedIcon
                  className="icon-card-item-material"
                  fontSize="small"
                />
              </div>
              <div className={element.description ? "" : "hidden"}>
                <DescriptionOutlinedIcon
                  className="icon-card-item-material"
                  fontSize="small"
                />
              </div>
              <div
                className={
                  element.check_letter.availability ? "status-list" : "hidden"
                }
              >
                <span className="comment-count">
                  {compliteListItem}/{fullCountListItem}
                </span>
                <ListAltIcon
                  className="icon-card-item-material"
                  fontSize="small"
                />
              </div>
              <div
                className={
                  element.comment.length > 0 ? "chat-bubble-outline" : "hidden"
                }
              >
                <ChatBubbleOutlineOutlinedIcon
                  className="icon-card-item-material"
                  fontSize="small"
                />{" "}
                <span className="comment-count">{element.comment.length}</span>
              </div>
            </div>
          </div>
        );
      }
    });
    const roleInf = saveRole
      .filter((e) => e.role && e.level)
      .map((e) => (e = `${e.role}-${e.level} `))
      .join(", ");
    return (
      <div key={e.card_item_id} className="card-item">
        <p>{e.card_name}</p>
        <div className="arr-task">{arrTask}</div>
        <div
          className={
            roleProfileInBoard.level == "Junior" &&
            roleProfileInBoard.role !== "Product manager"
              ? "hidden"
              : ""
          }
        >
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
              setStateList(false);
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
                className={
                  roleInf.length > 0 && handlerTitleCard.length > 0
                    ? "enable-btn-add-task"
                    : "disable-btn-add-task"
                }
                onClick={() => {
                  addTask(handlerTitleCard);
                  roleForNewTask([]);
                }}
                disabled={roleInf.length > 0 ? false : true}
              >
                Add card
              </button>
              <CloseIcon className="close-icon" onClick={closeBtn} />
              <WarningTooltipCustom value={roleInf} />
            </div>
            <MoreHorizIcon
              className="more-icon"
              onClick={() => {
                modalRoleShow(true);
              }}
            />
          </div>
        </div>
        <div
          className={
            roleProfileInBoard.level == "Junior" &&
            roleProfileInBoard.role !== "Product manager"
              ? "text-error-card-item"
              : "hidden"
          }
        >
          <h1>
            You can not add new tasks, add a task starting with the level
            "middle"
          </h1>
        </div>
      </div>
    );
  });
  return <React.Fragment>{label}</React.Fragment>;
};

const mapStateToProps = ({
  reducerSaveData: { socket, roleProfileInBoard, valueDisplay, saveRole },
  reducerDataIdentification: { email },
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
    roleHandler: (modalRoleData) => {
      dispatch(roleHandler(modalRoleData));
    },
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
