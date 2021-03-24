import React, { useEffect, useState, useRef } from "react";
import Header from "../header";
import { Link, useParams } from "react-router-dom";
import {
  saveActivityCard,
  saveDataToModal,
  saveFullCard,
  modalShow,
  displaySelection,
  recentActivity,
} from "../../action/action-login";
import { connect } from "react-redux";
import Loading from "../loading/loading";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import shortid from "shortid";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { roleDependencies } from "../role";
import MenuIcon from "@material-ui/icons/Menu";
import ModalDescription from "../modal-description-task/modal-description";
import Menu from "../menu/menu";
import { availCheck } from "../hooks/availability-check.hook";
import dateFormat from "dateformat";

const CardPage = ({
  saveActivityCard,
  saveFullCard,
  saveDataToModal,
  recentActivity,
  socket,
  roleProfileInBoard,
  email,
  dataToModal,
  show,
  modalShow,
  valueDisplay,
  displaySelection,
  activData,
}) => {
  let { name, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [arrInput, setArrInput] = useState([]);
  const [visiableBlock, setVisiableBlock] = useState([]);
  const [handlerTitleCard, setHandlerTitleCard] = useState([
    { id: "", title: "" },
  ]);
  const [inputAddCard, setInputAddCard] = useState(" ");
  const [stateList, setStateList] = useState(false);

  const [dataRole, setDataRole] = useState({
    role: "Back-end developer",
    level: "Junior",
  });
  const [dataRoleToSend, setDataRoleToSend] = useState([]);
  const [roleHandler, setRoleHandler] = useState("");

  const [stateMenu, setStateMenu] = useState(false);

  const ref = useRef(null);

  // Отслеживаем по какому элементу нажал пользователь, если вне одного из элемента с необходимым id
  // обновляются формы

  const handleClickOutside = (e) => {
    // if (e.target.id !== "click-outside-check" && e.which == 1) {
    //   setArrInput([]);
    //   setStateList(false);
    //   setHandlerTitleCard([{ id: "", title: "" }]);
    //   setInputAddCard("");
    //   setVisiableBlock([]);
    // }
  };

  // Processing the form data for adding a new card
  const handlerInputAddCard = (e) => {
    setInputAddCard(e.target.value);
  };

  // Adding a new card with Socket
  const addCard = async () => {
    let now = new Date();
    const id = shortid.generate();
    const item = {
      card_name: inputAddCard,
      card_body: [],
      card_item_id: id,
    };
    socket.emit("addCard", {
      data: item,
      id: name,
      dataActiv: {
        message: `User ${email} added a card "${inputAddCard}"`,
        email,
        date: dateFormat(now, "dd-mm-yyyy, hh:MM:ss "),
      },
    });
  };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // });

  // Getting data when the page is first loaded
  useEffect(() => {
    if (socket) {
      socket.emit("joinCard", {
        id: name,
        roleBack: roleProfileInBoard.role,
        levelBack: roleProfileInBoard.level,
      });
      socket.on("getCard", (value) => {
        saveActivityCard(value.filterCards[0]);
        saveFullCard(value.original[0]);
        displaySelection({
          valueDisp: value.filterCards[0],
          stateFilter: true,
        });
        recentActivity(value.original[0].recentActivity);
        setLoading(false);
      });
    }
  }, [name, socket]);

  // Add new Task through socket
  useEffect(() => {
    if (socket) {
      socket.on("newTask", (value) => {
        saveActivityCard({
          ...availCheck(value, valueDisplay.valueDisp, roleProfileInBoard),
        });
        const index = valueDisplay.valueDisp.cards.findIndex(
          (e) => e.card_item_id == value.card_item_id
        );
        const newItem = {
          ...valueDisplay.valueDisp,
          cards: [
            ...valueDisplay.valueDisp.cards.slice(0, index),
            value,
            ...valueDisplay.valueDisp.cards.slice(index + 1),
          ],
        };
        saveFullCard(newItem);
        if (!valueDisplay.stateFilter) {
          displaySelection({ valueDisp: newItem, stateFilter: false });
        } else {
          displaySelection({
            valueDisp: availCheck(
              value,
              valueDisplay.valueDisp,
              roleProfileInBoard
            ),
            stateFilter: true,
          });
        }
      });
      // After the data come to stop further sending
      return () => socket.off("newTask");
    }
  }, [socket, valueDisplay]);

  // Getting a new card via Socket
  useEffect(() => {
    if (socket) {
      socket.on("getCardItem", (value) => {
        saveActivityCard({ ...valueDisplay.valueDisp, cards: value.cards });
        if (!valueDisplay.stateFilter) {
          displaySelection({ valueDisp: value, stateFilter: false });
        } else {
          displaySelection({
            valueDisp: { ...valueDisplay.valueDisp, cards: value.cards },
            stateFilter: true,
          });
        }
      });
      return () => socket.off("getCardItem");
    }
  }, [socket, valueDisplay]);

  // Obtaining new task-related activities
  useEffect(() => {
    if (socket) {
      socket.on("newTaskActivity", (value) => {
        recentActivity(value);
      });
      // After the data come to stop further sending
      return () => socket.off("newTaskActivity");
    }
  }, [socket, activData]);

  // Receiving new activities related to the addition of a new card
  useEffect(() => {
    if (socket) {
      socket.on("getCardActivity", (value) => {
        recentActivity(value);
      });
      // After the data come to stop further sending
      return () => socket.off("getCardActivity");
    }
  }, [socket, activData]);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  const { name_Board, color, cards } = valueDisplay.valueDisp;

  // Вынести в отдельный файл
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
      if (
        !(
          element.role.findIndex((e) => e.role !== roleProfileInBoard.role) ==
            -1 &&
          element.role.findIndex(
            (e) =>
              statusProfile(e.level) <= statusProfile(roleProfileInBoard.level)
          ) !== -1
        ) ||
        roleProfileInBoard.role == "Product manager"
      ) {
        return (
          <div
            className="task-item task-item-for-all"
            key={i}
            onClick={() => {
              setStateMenu(false);
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
            setStateMenu(false);
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

  // main
  return (
    <div className={`${color} card-page`}>
      <ModalDescription show={show} dataToModal={dataToModal} />
      <div className="main-header-card-page">
        <Header color={color} />
      </div>
      <div className="header-card-page">
        <div className="header-card-page-block-one">
          <div className="name-command-card-page">
            <h1> {id.slice(0, id.length - 9)}</h1>
          </div>
          <div className="name-board-card-page">
            <h1> {name_Board}</h1>
          </div>
          <div className="name-command-card-page">
            <h1>{`${roleProfileInBoard.role}(${roleProfileInBoard.level})`}</h1>
          </div>
          <div className="name-command-card-page">
            <h1
              className={
                valueDisplay.stateFilter ? "text-display-state" : "hidden"
              }
            >
              Available
            </h1>
            <h1
              className={
                !valueDisplay.stateFilter ? "text-display-state" : "hidden"
              }
            >
              All
            </h1>
          </div>
        </div>
        <div className={stateMenu ? "menu-emergence" : "vis-hidden"}>
          <Menu onHide={() => setStateMenu(false)} />
        </div>
        <div
          className="header-card-page-block-two"
          onClick={() => {
            setStateMenu((prev) => !prev);
          }}
        >
          <p>
            <MenuIcon fontSize="small" />
            Menu
          </p>
        </div>
      </div>
      <div className="card-body">
        {label}
        <div
          className={`${
            roleProfileInBoard.level == "Senior" ||
            roleProfileInBoard.role == "Product manager"
              ? ""
              : "none-card-add"
          }`}
        >
          <div
            className={`card-add ${stateList ? "none-card-add" : ""}`}
            onClick={() => {
              setStateList(true);
            }}
          >
            <p>
              <AddIcon />
              Add another card
            </p>
          </div>
        </div>
        <div className={`card-item ${!stateList ? "none-card-add" : ""}`}>
          <div className="card-item-input-title">
            <input
              placeholder="Enter a title for the list"
              onChange={handlerInputAddCard}
              value={inputAddCard}
            />
          </div>
          <div className="add-card-btn-block">
            <button onClick={addCard}>Add a list</button>
            <CloseIcon
              className="close-icon"
              onClick={() => {
                setStateList(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({
  getDataReducer: {
    card,
    cardFull,
    socket,
    roleProfileInBoard,
    email,
    dataToModal,
    show,
    valueDisplay,
    activData,
  },
  loginReducer: { token },
}) => {
  return {
    token,
    card,
    socket,
    roleProfileInBoard,
    email,
    dataToModal,
    show,
    valueDisplay,
    cardFull,
    activData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recentActivity: (activData) => {
      dispatch(recentActivity(activData));
    },
    displaySelection: (valueDisplay) => {
      dispatch(displaySelection(valueDisplay));
    },
    modalShow: (show) => {
      dispatch(modalShow(show));
    },
    saveDataToModal: (dataToModal) => {
      dispatch(saveDataToModal(dataToModal));
    },
    saveFullCard: (cardFull) => {
      dispatch(saveFullCard(cardFull));
    },
    saveActivityCard: (card) => {
      dispatch(saveActivityCard(card));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardPage);
