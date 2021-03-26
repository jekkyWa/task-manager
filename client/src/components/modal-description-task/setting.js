import React from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import { recentActivity, modalShow } from "../../action/action-login";
import { connect } from "react-redux";

const Setting = ({
  email,
  socket,
  dataToModal,
  modalShow,
  roleProfileInBoard,
  valueDisplay,
  cardFull,
  recentActivity,
  activData,
}) => {
  const item = cardFull.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];
  const setting = item.card_body.filter((e) => dataToModal.id == e.id_task)[0];

  const deleteTask = async () => {
    modalShow(false);
    await socket.emit("deleteTask", {
      id_board: dataToModal.board_id,
      id_card: dataToModal.card_id,
      id_task: dataToModal.id,
    });
  };

  if (setting.name_add == email) {
    return (
      <React.Fragment>
        <div className="modal-description-add-description">
          <div>
            <SettingsIcon />
          </div>
          <div>
            <h2>Настройки</h2>
          </div>
        </div>
        <div className="buttons-settings">
          <div>
            <button>Переместить</button>
          </div>
          <div>
            <button>Добавить чек-лист</button>
          </div>
          <div>
            <button>Изменить роли</button>
          </div>
          <div>
            <button
              onClick={() => {
                deleteTask();
              }}
            >
              Удалить задание
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
  return null;
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { roleProfileInBoard, valueDisplay, activData, cardFull },
}) => {
  return { token, roleProfileInBoard, valueDisplay, activData, cardFull };
};

const mapDispatchToProps = (dispatch) => {
  return {
    recentActivity: (activData) => {
      dispatch(recentActivity(activData));
    },
    modalShow: (show) => {
      dispatch(modalShow(show));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
