import React, { useEffect, useState, useRef } from "react";
import Header from "../header";
import { useHttp } from "../hooks/http.hook";
import { Link, useParams } from "react-router-dom";
import { saveActivityCard } from "../../action/action-login";
import { connect } from "react-redux";
import Loading from "../loading/loading";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import shortid from "shortid";
import io from "socket.io-client";

const CardPage = ({ token, saveActivityCard, card }) => {
  const { request } = useHttp();
  let { name, id } = useParams();

  const [loading, setLoading] = useState(true);
  const [arrInput, setArrInput] = useState([]);
  const [handlerTitleCard, setHandlerTitleCard] = useState([
    { id: "", title: "" },
  ]);
  const [stateList, setStateList] = useState(false);
  const [update, setUpdate] = useState(false);
  const [activeObj, setActiveObj] = useState("");

  // Отслеживаем по какому элементу нажал пользователь, если вне одного из элемента с необходимым id
  // обновляются формы

  const handleClickOutside = (e) => {
    console.log(card);
    if (e.target.id !== "click-outside-check" && e.which == 1) {
      setArrInput([]);
      setStateList(false);
      setHandlerTitleCard([{ id: "", title: "" }]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const getDataCards = async () => {
    try {
      const value = await request(
        "/api/getCard",
        "POST",
        { card_id: name },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      saveActivityCard(value.filterCard[0]);
      setLoading(false);
      setUpdate(false);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getDataCards();
  }, [name, update]);

  useEffect(() => {
    const socket = io();
    socket.emit("CARDS:GET", { card_id: name });
    socket.on("CARD:GET", (data) =>{
      console.log("New user",data)
    })
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  const { name_Board, color, cards } = card;

  const label = cards.map((e) => {
    const card_body_id = shortid.generate();
    const addTask = async (value) => {
      setActiveObj({
        card_item_id: e.card_item_id,
        card_id: name,
        task: { title: value.title, id_task: card_body_id },
      });

      try {
        console.log(e.card_item_id);

        const data = await request(
          "/api/addTask",
          "POST",
          {
            card_item_id: e.card_item_id,
            card_id: name,
            task: { title: value.title, id_task: card_body_id },
          },
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setUpdate(true);
      } catch (e) {
        console.error(e);
      }
      console.log(value);
    };

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

    const arrTask = e.card_body.map((e, i) => {
      return (
        <div className="task-item" key={i}>
          <p>{e.title}</p>
        </div>
      );
    });

    return (
      <div key={e.card_item_id} className="card-item" id="click-outside-check">
        <p id="click-outside-check">{e.card_name}</p>
        {arrTask}
        <textarea
          id="click-outside-check"
          className={arrInput.indexOf(e.card_item_id) == -1 ? "hidden" : ""}
          placeholder="Enter a title for this card"
          onChange={onChangeTitleTaskHandler}
          name={e.card_item_id}
          value={
            handlerTitleCard.findIndex((element) => {
              return element.id === e.card_item_id;
            }) !== -1
              ? handlerTitleCard[
                  handlerTitleCard.findIndex((element) => {
                    return element.id === e.card_item_id;
                  })
                ].title
              : ""
          }
        />
        <p
          id="click-outside-check"
          className={`add-card-text ${
            arrInput.indexOf(e.card_item_id) !== -1 ? "hidden" : ""
          }`}
          onClick={() => {
            setArrInput([...arrInput, e.card_item_id]);
            let arr = [...arrInput, e.card_item_id];
            let index = arr.findIndex((element) => {
              return element === e.card_item_id;
            });
            console.log(index);
            const newItem = {
              id: e.card_item_id,
              title: "",
            };
            setHandlerTitleCard([
              ...handlerTitleCard.slice(0, index),
              newItem,
              ...handlerTitleCard.slice(index + 1),
            ]);
          }}
        >
          <AddIcon id="click-outside-check" /> Add card
        </p>
        <div
          id="click-outside-check"
          className={
            arrInput.indexOf(e.card_item_id) == -1
              ? "hidden"
              : "add-card-btn-block"
          }
        >
          <button
            id="click-outside-check"
            onClick={() => {
              const index = handlerTitleCard.findIndex((element) => {
                return element.id === e.card_item_id;
              });
              if (handlerTitleCard[index]) addTask(handlerTitleCard[index]);
            }}
          >
            Add card
          </button>
          <CloseIcon
            id="click-outside-check"
            className="close-icon"
            onClick={() => {
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
            }}
          />
        </div>
      </div>
    );
  });
  return (
    <div className={`${color} card-page`}>
      <Header color={color} />
      <div className="header-card-page">
        <div className="name-command-card-page">
          <h1> {id.slice(0, id.length - 9)}</h1>
        </div>
        <div className="name-board-card-page">
          <h1> {name_Board}</h1>
        </div>
      </div>
      <div className="card-body">
        {label}
        <div
          className={`card-add ${stateList ? "none-card-add" : ""}`}
          onClick={() => {
            setStateList(true);
          }}
          id="click-outside-check"
        >
          <p id="click-outside-check">
            <AddIcon />
            Add another card
          </p>
        </div>
        <div
          id="click-outside-check"
          className={`card-item ${!stateList ? "none-card-add" : ""}`}
        >
          <div id="click-outside-check" className="card-item-input-title">
            <input
              id="click-outside-check"
              placeholder="Enter a title for the list"
            />
          </div>
          <div id="click-outside-check" className="add-card-btn-block">
            <button id="click-outside-check">Add a list</button>
            <CloseIcon
              id="click-outside-check"
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
  getDataReducer: { card },
  loginReducer: { token },
}) => {
  return { token, card };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveActivityCard: (card) => {
      dispatch(saveActivityCard(card));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardPage);
