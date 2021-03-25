import React, { useState } from "react";
import { saveDataToModal, modalShow } from "../../action/action-login";
import { Link, useParams } from "react-router-dom";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { roleDependencies } from "../role";
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
  saveDataToModal,
}) => {
  let { name } = useParams();
  const [arrInput, setArrInput] = useState([]);
  const [visiableBlock, setVisiableBlock] = useState([]);
  const [handlerTitleCard, setHandlerTitleCard] = useState([
    { id: "", title: "" },
  ]);
  const [dataRole, setDataRole] = useState({
    role: "Back-end developer",
    level: "Junior",
  });
  const [dataRoleToSend, setDataRoleToSend] = useState([]);
  const [roleHandler, setRoleHandler] = useState("");
  const { cards } = valueDisplay.valueDisp;

  const label = cards.map((e) => {
    const card_body_id = shortid.generate();

    // Sending data to the server
    const addTask = async (value) => {
      let now = new Date();
      let active = {
        card_item_id: e.card_item_id,
        card_id: name,
        task: {
          title: value.title,
          description: "",
          id_task: card_body_id,
          role: dataRoleToSend,
          name_add: email,
          comment: [],
          nameOfTaker: "",
          state: false,
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
      setArrInput([...arrInput, e.card_item_id]);
      let arr = [...arrInput, e.card_item_id];
      let index = arr.findIndex((element) => {
        return element === e.card_item_id;
      });
      const newItem = {
        id: e.card_item_id,
        title: "",
      };
      setHandlerTitleCard([
        ...handlerTitleCard.slice(0, index),
        newItem,
        ...handlerTitleCard.slice(index + 1),
      ]);
    };

    // Realization close btn
    const closeBtn = () => {
      setHandlerTitleCard([
        ...handlerTitleCard.slice(
          0,
          handlerTitleCard.findIndex((element) => {
            return element.id === e.card_item_id;
          })
        ),
        ...handlerTitleCard.slice(
          handlerTitleCard.findIndex((element) => {
            return element.id === e.card_item_id;
          }) + 1
        ),
      ]);
      setArrInput([
        ...arrInput.slice(0, arrInput.indexOf(e.card_item_id)),
        ...arrInput.slice(arrInput.indexOf(e.card_item_id) + 1),
      ]);
    };

    // !Displays the block to add roles.
    const visiabilityBlock = () => {
      setVisiableBlock([
        ...visiableBlock.slice(0, visiableBlock.indexOf(e.card_item_id)),
        ...visiableBlock.slice(visiableBlock.indexOf(e.card_item_id) + 1),
      ]);
    };

    // Data Processing for New Card
    const onChangeTitleTaskHandler = (event) => {
      let index = arrInput.findIndex((element) => element == event.target.name);
      const newItem = {
        id: event.target.name,
        title: event.target.value,
      };
      setHandlerTitleCard([
        ...handlerTitleCard.slice(0, index),
        newItem,
        ...handlerTitleCard.slice(index + 1),
      ]);
    };

    // Processing form data, block for adding roles and levels
    const inputRoleHandler = (e) => {
      setRoleHandler(e.target.value);
    };

    // Processing role data and levels
    const roleAndLvlHandler = (e) => {
      setDataRole({ ...dataRole, [e.target.name]: e.target.value });
    };

    // Adding a role in the form
    const addRole = () => {
      setRoleHandler(
        (prev) =>
          `${prev.length !== 0 ? prev + ", " : prev} ${dataRole.role}-${
            dataRole.level
          }`
      );
    };

    // Saving all added roles for the task
    const addRolesToSend = () => {
      const arrRole = roleHandler.split(", ");
      const newItem = arrRole.map((e, i) => {
        const id = e.lastIndexOf("-");
        return (e = {
          role: e.slice(0, id).trim(),
          level: e.slice(id + 1).trim(),
        });
      });
      setDataRoleToSend(newItem);
      visiabilityBlock();
    };

    // Recruiling new cards
    const arrTask = e.card_body.map((element, i) => {
      const label = element.role.map((e, i) => {
        return <span key={i}>{e.role + e.level}</span>;
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
                });
              }}
            >
              <p>
                {element.title}({label})
              </p>
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
              });
              modalShow(true);
            }}
          >
            <p>
              {element.title}({label})
            </p>
            <div className="item-block-icon-state">
              <div className={element.comment.length > 0 ? "" : "hidden"}>
                <ChatBubbleOutlineOutlinedIcon fontSize="small" />{" "}
                <span>{element.comment.length}</span>
              </div>
              <div className="hidden">
                <CheckCircleOutlineOutlinedIcon />
              </div>
              <div className={element.description ? "" : "hidden"}>
                <DescriptionOutlinedIcon fontSize="small" />
              </div>
            </div>
          </div>
        );
      }
    });

    // Отображение только нужного блока для ввода нового Task
    const valueBodyTask =
      handlerTitleCard.findIndex((element) => {
        return element.id === e.card_item_id;
      }) !== -1
        ? handlerTitleCard[
            handlerTitleCard.findIndex((element) => {
              return element.id === e.card_item_id;
            })
          ].title
        : "";

    return (
      <div key={e.card_item_id} className="card-item">
        <p>{e.card_name}</p>
        <div className="arr-task">{arrTask}</div>
        <textarea
          className={arrInput.indexOf(e.card_item_id) == -1 ? "hidden" : ""}
          placeholder="Enter a title for this card"
          onChange={onChangeTitleTaskHandler}
          name={e.card_item_id}
          value={valueBodyTask}
        />
        <p
          className={`add-card-text ${
            arrInput.indexOf(e.card_item_id) !== -1 ? "hidden" : ""
          }`}
          onClick={addCardBlock}
        >
          <AddIcon fontSize="small" /> Add card
        </p>
        <div
          className={
            arrInput.indexOf(e.card_item_id) == -1
              ? "hidden"
              : "add-card-btn-block"
          }
        >
          <div>
            <button
              onClick={() => {
                const index = handlerTitleCard.findIndex((element) => {
                  return element.id === e.card_item_id;
                });
                if (handlerTitleCard[index]) addTask(handlerTitleCard[index]);
              }}
            >
              Add card
            </button>
            <CloseIcon className="close-icon" onClick={closeBtn} />
          </div>
          <MoreHorizIcon
            className="more-icon"
            onClick={() => {
              setVisiableBlock([e.card_item_id]);
            }}
          />
          <div
            className={
              visiableBlock.indexOf(e.card_item_id) == -1
                ? "hidden"
                : "role-add-card-page"
            }
          >
            <div className="header-role-block">
              <p>Выбрать роль</p>
              <CloseIcon className="close-icon" onClick={visiabilityBlock} />
            </div>

            <input
              placeholder="List participants in role-level format separated by commas"
              value={roleHandler}
              onChange={inputRoleHandler}
            />
            {roleDependencies(roleProfileInBoard, roleAndLvlHandler)}
            <button className="add-role-to-form-btn" onClick={addRole}>
              Add role to form
            </button>
            <button className="add-role-to-task-btn" onClick={addRolesToSend}>
              Save and close
            </button>
          </div>
        </div>
      </div>
    );
  });
  return <React.Fragment>{label}</React.Fragment>;
};

const mapStateToProps = ({
  getDataReducer: { socket, roleProfileInBoard, email, valueDisplay },
  loginReducer: { token },
}) => {
  return {
    token,
    socket,
    roleProfileInBoard,
    email,
    valueDisplay,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    modalShow: (show) => {
      dispatch(modalShow(show));
    },
    saveDataToModal: (dataToModal) => {
      dispatch(saveDataToModal(dataToModal));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardItem);
