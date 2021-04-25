import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import shortid from "shortid";
import dateFormat from "dateformat";
import { useHistory } from "react-router-dom";
// files
import Header from "../../header";
import Loading from "../../loading/loading-main/loading";
import ModalDescription from "../../modal/modal-description-task/modal-description-main/modal-description";
import Menu from "../../menu/menu/menu";
import { availCheck } from "../../utils/availability-check";
import CardItem from "./blocks/card-item";
import ModalAddRole from "../../modal/modal-add-role/modal-add-role";
import "./card-page.scss";
// redux
import {
  displaySelection,
  recentActivity,
} from "../../../action/action-save-date";
import { modalShow } from "../../../action/action-modal";
import {
  saveActivityCard,
  saveDataToModal,
  saveFullCard,
} from "../../../action/action-save-date";
import { connect } from "react-redux";
// material
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import MenuIcon from "@material-ui/icons/Menu";

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
  const history = useHistory();

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

  useEffect(() => {
    if (socket) {
      socket.on("getChangeRole", (value) => {
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
        console.log(activData);
      });
      return () => socket.emit("leaveRoomCard", { id: name });
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

  // Update all items when deleting a user
  useEffect(() => {
    if (socket) {
      socket.on("getDataAfterDeleteUser", (value) => {
        if (
          value.board.addedUsers.findIndex((e) => e.email == email) == -1 &&
          email !== value.board.creator &&
          id.slice(id.length - 10) == value.board.board_id
        ) {
          history.push("/page");
        }
      });
      return () => socket.off("getDataAfterDeleteUser");
    }
  }, [socket]);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  const { name_Board, color } = valueDisplay.valueDisp;

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
                {id.slice(0, id.length - 10)}
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
            {/* Show only accessible tasks */}
            <h1
              className={
                valueDisplay.stateFilter ? "text-display-state" : "hidden"
              }
            >
              Visibility: <span className="selected-text">Available</span>
            </h1>
            {/* Show all tasks */}
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
            <span className="menu-txt">Menu</span>
          </p>
        </div>
      </div>
      <div className="card-body">
        <CardItem />
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
  reducerSaveData: {
    valueDisplay,
    activData,
    card,
    cardFull,
    socket,
    roleProfileInBoard,
    dataToModal,
  },
  reducerDataIdentification: { email },
  reducerModal: { show },
}) => {
  return {
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
