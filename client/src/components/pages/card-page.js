import React, { useEffect, useState, useRef } from "react";
import Header from "../header";
import { useParams } from "react-router-dom";
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
import MenuIcon from "@material-ui/icons/Menu";
import ModalDescription from "../modal-description-task/modal-description";
import Menu from "../menu/menu";
import { availCheck } from "../hooks/availability-check.hook";
import dateFormat from "dateformat";
import CardItem from "../card-item/card-item";
import ModalAddRole from "../modal-add-role/modal-add-role";

const CardPage = ({
  saveActivityCard,
  saveFullCard,
  recentActivity,
  socket,
  roleProfileInBoard,
  email,
  dataToModal,
  show,
  valueDisplay,
  displaySelection,
  activData,
  cardFull,
  card,
}) => {
  let { name, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [inputAddCard, setInputAddCard] = useState("");
  const [stateList, setStateList] = useState(false);
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
      roleBack: roleProfileInBoard.role,
      levelBack: roleProfileInBoard.level,
    });
  };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // });

  useEffect(() => {
    if (socket) {
      socket.on("getChangeRole", (value) => {
        console.log(value);
        if (dataToModal) {
          const item = value.cards.filter(
            (e) => e.card_item_id == dataToModal.card_id
          )[0];
          saveActivityCard({ ...availCheck(item, card, roleProfileInBoard) });
          const index = valueDisplay.valueDisp.cards.findIndex(
            (e) => e.card_item_id == item.card_item_id
          );

          const newItem = {
            ...valueDisplay.valueDisp,
            cards: [
              ...cardFull.cards.slice(0, index),
              item,
              ...cardFull.cards.slice(index + 1),
            ],
          };
          saveFullCard(newItem);
          if (!valueDisplay.stateFilter) {
            displaySelection({ valueDisp: newItem, stateFilter: false });
          } else {
            displaySelection({
              valueDisp: availCheck(
                item,
                valueDisplay.valueDisp,
                roleProfileInBoard
              ),
              stateFilter: true,
            });
          }
        }
      });

      return () => socket.off("getChangeRole");
    }
  }, [socket, valueDisplay, dataToModal]);

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
            ...cardFull.cards.slice(0, index),
            value,
            ...cardFull.cards.slice(index + 1),
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

  // Add card
  useEffect(() => {
    if (socket) {
      socket.on("getCardItem", (value) => {
        saveActivityCard(value.filterCards);
        saveFullCard(value.original);
        if (!valueDisplay.stateFilter) {
          displaySelection({ valueDisp: value.original, stateFilter: false });
        } else {
          displaySelection({
            valueDisp: value.filterCards,
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

  const { name_Board, color } = valueDisplay.valueDisp;

  // main
  return (
    <div className={`${color} card-page`}>
      <ModalDescription show={show} />
      <ModalAddRole />
      <div className="main-header-card-page">
        <Header color={color} />
      </div>
      <div className="header-card-page">
        <div className="header-card-page-block-one">
          <div className="name-command-card-page">
            <h1>
              Team name:{" "}
              <span className="selected-text">
                {id.slice(0, id.length - 9)}
              </span>
            </h1>
          </div>
          <div className="name-board-card-page">
            <h1> {name_Board}</h1>
          </div>
          <div className="name-command-card-page">
            <h1>
              Role:{" "}
              <span className="selected-text">{roleProfileInBoard.role}</span>
            </h1>
          </div>
          <div className="name-command-card-page">
            <h1>
              Level:{" "}
              <span className="selected-text">{roleProfileInBoard.level}</span>
            </h1>
          </div>

          <div className="name-command-card-page">
            <h1
              className={
                valueDisplay.stateFilter ? "text-display-state" : "hidden"
              }
            >
              Visibility: <span className="selected-text">Available</span>
            </h1>
            <h1
              className={
                !valueDisplay.stateFilter ? "text-display-state" : "hidden"
              }
            >
              Visibility: <span className="selected-text">All</span>
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
            <spana className="menu-txt">Menu</spana>
          </p>
        </div>
      </div>
      <div className="card-body">
        <CardItem />
        {/* <div className="card-item">
          <p>Done</p>
          <div className="arr-task">
            <div className="task-item task-item">
              <p>test</p>
            </div>
            В данный момент команда не выполнила ни одного задания
          </div>
        </div> */}
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
              <AddIcon fontSize="small" />
              <span className="menu-txt">Add another card</span>
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
