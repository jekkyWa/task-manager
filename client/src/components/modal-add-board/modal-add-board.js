import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { saveDataCards } from "../../action/action-login";
import { connect } from "react-redux";
import "./modal-add-board.scss";
import { useParams } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import { useHttp } from "../hooks/http.hook";
import shortid from "shortid";

const ModalAddBoard = ({ show, onHide, token, saveDataCards }) => {
  let { id } = useParams();
  let [backColor, setBackColor] = useState("blue-one");
  let [disable, setDisable] = useState(true);
  let [formAddedBoard, setFormAddedBoard] = useState("");

  const { request, loading } = useHttp();

  const onChangeModalBoardHandler = (e) => {
    if (e.target.value.length > 0) setDisable(false);
    else setDisable(true);
    setFormAddedBoard(e.target.value);
  };

  const sendInfoBoard = async () => {
    try {
      let card_id = shortid.generate();
      let dataForSend = {
        name_Board: formAddedBoard,
        color: backColor,
        card_id,
        board_id: id.slice(id.length - 9),
        cards: [
          { card_name: "Need to do", card_body: [] },
          { card_name: "During", card_body: [] },
          { card_name: "Done", card_body: [] },
        ],
      };
      setDisable(true);
      await request("/api/createCard", "POST", dataForSend, {
        Authorization: `Bearer ${token}`,
      });
      const value = await request(
        "/api/getBoards",
        "POST",
        { board_id: id.slice(id.length - 9) },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      saveDataCards(value.filterCards);
      onHide();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      dialogClassName="modal-90w"
      show={show}
      onHide={() => {
        setFormAddedBoard("");
        onHide();
      }}
    >
      <Modal.Body>
        <div className={`board-block ${backColor}`}>
          <div className="input-modal-block">
            <div className="input-modal-board">
              <input
                placeholder="Add Board Title"
                onChange={onChangeModalBoardHandler}
              />
            </div>
            <div className="close-icon">
              <CloseIcon onClick={onHide} fontSize="small" />
            </div>
          </div>
          <div className="name-room-board">
            <p>{id.slice(0, id.length - 9)}</p>
          </div>
        </div>
        <div className="color-body">
          <div
            className="color-item-blue-one"
            onClick={() => {
              setBackColor("blue-one");
            }}
          ></div>
          <div
            className="color-item-orange"
            onClick={() => {
              setBackColor("orange");
            }}
          ></div>
          <div
            className="color-item-green-one"
            onClick={() => {
              setBackColor("green-one");
            }}
          ></div>
          <div
            className="color-item-red"
            onClick={() => {
              setBackColor("red");
            }}
          ></div>
          <div
            className="color-item-phiol"
            onClick={() => {
              setBackColor("phiol");
            }}
          ></div>
          <div
            className="color-item-pink"
            onClick={() => {
              setBackColor("pink");
            }}
          ></div>
          <div
            className="color-item-green-two"
            onClick={() => {
              setBackColor("green-two");
            }}
          ></div>
          <div
            className="color-item-blue-two"
            onClick={() => {
              setBackColor("blue-two");
            }}
          ></div>
          <div
            className="color-item-gray"
            onClick={() => {
              setBackColor("gray");
            }}
          ></div>
        </div>
      </Modal.Body>
      <div className="modal-board-button">
        <button
          className={!disable ? "enable" : "disable"}
          disabled={disable}
          onClick={sendInfoBoard}
        >
          {loading ? "loading" : "Cоздать доску"}
        </button>
      </div>
    </Modal>
  );
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { active_rooms, name },
}) => {
  return { token, active_rooms, name };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataCards: (boards) => {
      dispatch(saveDataCards(boards));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddBoard);
