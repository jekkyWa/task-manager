import React, { useEffect, useState, useRef } from "react";
import Header from "../header";
import { Link, useParams } from "react-router-dom";
import {
  saveActivityCard,
  saveDataToModal,
  saveFullCard,
  modalShow,
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

const CardPage = ({
  saveActivityCard,
  saveFullCard,
  saveDataToModal,
  card,
  socket,
  roleProfileInBoard,
  email,
  dataToModal,
  show,
  modalShow,
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

  // Обработка данных формы для добавления новой карточки

  const handlerInputAddCard = (e) => {
    setInputAddCard(e.target.value);
  };

  // Добавление новой карточки с помощью socket
  const addCard = async () => {
    const id = shortid.generate();
    const item = {
      card_name: inputAddCard,
      card_body: [],
      card_item_id: id,
    };
    socket.emit("addCard", { data: item, id: name });
  };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // });

  // Получение данных при первой загрузке страницы

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
        setLoading(false);
      });
    }
  }, [name, socket]);

  // Добавлнение нового task через socket
  useEffect(() => {
    if (socket) {
      socket.on("newTask", (value) => {
        saveActivityCard({ ...availCheck(value, card, roleProfileInBoard) });
      });
      // После того как данные придут остановить дальнейшую отправку
      return () => socket.off("newTask");
    }
  }, [socket, card]);

  // Получение новой карточки через socket

  useEffect(() => {
    if (socket) {
      socket.on("getCardItem", (value) => {
        saveActivityCard({ ...card, cards: value.cards });
      });
      return () => socket.off("getCardItem");
    }
  }, [socket, card]);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  const { name_Board, color, cards } = card;

  // Вынести в отдельный файл

  const label = cards.map((e) => {
    const card_body_id = shortid.generate();
    // Отправка данных на сервер
    const addTask = async (value) => {
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
        roleBack: roleProfileInBoard.role,
        levelBack: roleProfileInBoard.level,
      });
    };

    // Отображение формы с кнопками для создания Task
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

    // Реализация close btn
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

    // !Отображение блока для добавления ролей.

    const visiabilityBlock = () => {
      setVisiableBlock([
        ...visiableBlock.slice(0, visiableBlock.indexOf(e.card_item_id)),
        ...visiableBlock.slice(visiableBlock.indexOf(e.card_item_id) + 1),
      ]);
    };

    // Обработка данных для новой карточки
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

    // Обработка данных формы, блока для добавления ролей и уровней

    const inputRoleHandler = (e) => {
      setRoleHandler(e.target.value);
    };

    // Обработка данных ролей и уровней

    const roleAndLvlHandler = (e) => {
      setDataRole({ ...dataRole, [e.target.name]: e.target.value });
    };

    // Добавление роли в форму

    const addRole = () => {
      setRoleHandler(
        (prev) =>
          `${prev.length !== 0 ? prev + ", " : prev} ${dataRole.role}-${
            dataRole.level
          }`
      );
    };

    // Сохранение всех добавленных ролей для задачи

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

    // Отрисовка новых карточек

    const arrTask = e.card_body.map((element, i) => {
      const label = element.role.map((e, i) => {
        return <span key={i}>{e.role + e.level}</span>;
      });

      return (
        <div
          className="task-item"
          key={i}
          onClick={() => {
            setStateMenu(false);
            modalShow(true);
            saveDataToModal(
              {
                name: element.title,
                column: e.card_name,
                id: element.id_task,
                card_id: e.card_item_id,
                board_id: name,
                name_add: element.name_add,
              },
              true
            );
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
          <AddIcon /> Add card
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
          <div className="name-board-card-page">
            <p>В данный момент отображаются только доступные для вашей роли задания</p>
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
    socket,
    roleProfileInBoard,
    email,
    dataToModal,
    show,
  },
  loginReducer: { token },
}) => {
  return { token, card, socket, roleProfileInBoard, email, dataToModal, show };
};

const mapDispatchToProps = (dispatch) => {
  return {
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
