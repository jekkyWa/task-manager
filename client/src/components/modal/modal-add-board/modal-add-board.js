import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import shortid from "shortid";
// files
import "./modal-add-board.scss";
import { BoxColor } from "./blocks/box-color";
import LoadingBtn from "../../loading/loading-btn/loading-btn";
// redux
import { saveDataCards } from "../../../action/action-save-date";
import { connect } from "react-redux";
// material
import CloseIcon from "@material-ui/icons/Close";

const ModalAddBoard = ({ show, onHide, saveDataCards, socket, boards }) => {
  const { id } = useParams();

  const [backColor, setBackColor] = useState("blue-one");
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [formAddedBoard, setFormAddedBoard] = useState("");

  // Handler title modal
  const onChangeModalBoardHandler = (e) => {
    // Changes the styles of the buttons if the data is presented in the form
    if (e.target.value.length > 0) setDisable(false);
    else setDisable(true);
    setFormAddedBoard(e.target.value);
  };

  // Full Clearing Data Modal Window
  const clearModal = () => {
    onHide();
    setDisable(true);
    setFormAddedBoard("");
  };

  // Sending data to create a new board
  const sendInfoBoard = async () => {
    setLoading(true);
    let card_id = shortid.generate();
    // Generation ID for the first three mandatory cards
    let card_item_id_one = shortid.generate();
    let card_item_id_two = shortid.generate();
    let card_item_id_three = shortid.generate();
    // Preparation of data for sending
    let dataForSend = {
      name_Board: formAddedBoard,
      color: backColor,
      card_id,
      board_id: id.slice(id.length - 10),
      cards: [
        {
          card_name: "Must be done first",
          card_body: [],
          card_item_id: card_item_id_one,
        },
        {
          card_name: "Need to do",
          card_body: [],
          card_item_id: card_item_id_two,
        },
        {
          card_name: "During",
          card_body: [],
          card_item_id: card_item_id_three,
        },
      ],
    };
    setLoading(false);
    clearModal();
    socket.emit("board", { dataForSend, id: id.slice(id.length - 10) });
  };

  useEffect(() => {
    if (socket) {
      socket.on("newBoard", (value) => {
        saveDataCards([...boards, value]);
        console.log(boards);
      });
      return () => socket.off("newBoard");
    }
  }, [socket, boards]);

  return (
    <Modal dialogClassName="modal-90w" show={show} onHide={clearModal}>
      <Modal.Body>
        <div className={`board-block ${backColor}`}>
          <div className="input-modal-block">
            <div className="input-modal-board">
              <input
                placeholder="Add Board Title"
                onChange={onChangeModalBoardHandler}
                value={formAddedBoard}
              />
            </div>
            <div className="close-icon">
              <CloseIcon onClick={clearModal} fontSize="small" />
            </div>
          </div>
          <div className="name-room-board">
            <p>{id.slice(0, id.length - 10)}</p>
          </div>
        </div>
        {/* Blocks with colors */}
        <div className="color-body">
          <BoxColor
            style="color-item-blue-one"
            func={setBackColor}
            value="blue-one"
            backColor={backColor}
          />
          <BoxColor
            style="color-item-orange"
            func={setBackColor}
            value="orange"
            backColor={backColor}
          />
          <BoxColor
            style="color-item-green-one"
            func={setBackColor}
            value="green-one"
            backColor={backColor}
          />
          <BoxColor
            style="color-item-red"
            func={setBackColor}
            value="red"
            backColor={backColor}
          />
          <BoxColor
            style="color-item-phiol"
            func={setBackColor}
            value="phiol"
            backColor={backColor}
          />
          <BoxColor
            style="color-item-pink"
            func={setBackColor}
            value="pink"
            backColor={backColor}
          />
          <BoxColor
            style="color-item-green-two"
            func={setBackColor}
            value="green-two"
            backColor={backColor}
          />
          <BoxColor
            style="color-item-blue-two"
            func={setBackColor}
            value="blue-two"
            backColor={backColor}
          />
          <BoxColor
            style="color-item-gray"
            func={setBackColor}
            value="gray"
            backColor={backColor}
          />
        </div>
      </Modal.Body>
      <div className="modal-board-button">
        <button
          className={!disable ? "enable" : "disable"}
          disabled={disable}
          onClick={sendInfoBoard}
        >
          {loading ? <LoadingBtn /> : "Create a board"}
        </button>
      </div>
    </Modal>
  );
};

const mapStateToProps = ({
  loginReducer: { token },
  reducerSaveData: { active_rooms, boards, socket },
  reducerDataIdentification: { email, name },
}) => {
  return { token, active_rooms, name, boards, socket };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataCards: (boards) => {
      dispatch(saveDataCards(boards));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddBoard);
