import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import CloseIcon from "@material-ui/icons/Close";

const DescriptionBlock = ({
  dataToModal,
  email,
  socket,
  card,
  valueDisplay,
}) => {
  const [descriptionTask, setDescriptionTask] = useState("");
  const [descriptionState, setDescriptionState] = useState(false);
  const ref = useRef(null);

  const focus = () => {
    ref.current.focus();
  };

  // Данные описания Task
  const onChangeDescriptionTask = (e) => {
    setDescriptionTask(e.target.value);
  };

  // Добавление данных на сервер
  const addDescriptionToTask = () => {
    socket.emit("addDescriptionToTask", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
      data: descriptionTask,
    });
    setTimeout(() => {
      setDescriptionState(false);
    }, 100);
  };

  // Находим нужное описание
  const description = valueDisplay.valueDisp.cards
    .filter((e) => e.card_item_id == dataToModal.card_id)[0]
    .card_body.filter((e) => dataToModal.id == e.id_task)[0];

  if (description.description && dataToModal.name_add == email) {
    return (
      <div>
        <React.Fragment>
          <div
            className={
              !descriptionState ? "modal-description-select-input" : "hidden"
            }
            onClick={() => {
              setDescriptionState(true);
            }}
          >
            <p onClick={focus}>{description.description}</p>
          </div>
          <div
            className={descriptionState ? "modal-description-input" : "hidden"}
          >
            <textarea ref={ref} onChange={onChangeDescriptionTask} />
            <button
              className="modal-description-btn-save"
              onClick={addDescriptionToTask}
            >
              Сохранить
            </button>
            <CloseIcon
              className="modal-description-close-icon"
              onClick={() => {
                setDescriptionState(false);
              }}
            />
          </div>
        </React.Fragment>
      </div>
    );
  } else if (description.description) {
    return <p>{description.description}</p>;
  } else if (dataToModal.name_add == email) {
    return (
      <React.Fragment>
        <div
          className={
            !descriptionState ? "modal-description-select-input" : "hidden"
          }
          onClick={() => {
            setDescriptionState(true);
          }}
        >
          <p onClick={focus}>Добавить более подробное описание...</p>
        </div>
        <div
          className={descriptionState ? "modal-description-input" : "hidden"}
        >
          <textarea ref={ref} onChange={onChangeDescriptionTask} />
          <button
            className="modal-description-btn-save"
            onClick={addDescriptionToTask}
          >
            Сохранить
          </button>
          <CloseIcon
            className="modal-description-close-icon"
            onClick={() => {
              setDescriptionState(false);
            }}
          />
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <div>
        <p>Создатель задания еще не добавил описание</p>
      </div>
    );
  }
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { card, valueDisplay },
}) => {
  return { token, card, valueDisplay };
};

export default connect(mapStateToProps, null)(DescriptionBlock);
