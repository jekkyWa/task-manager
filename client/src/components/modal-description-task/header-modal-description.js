import React from "react";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { connect } from "react-redux";

const HeaderModalDescription = ({
  dataToModal,
  email,
  socket,
  cardFull,
  activData,
}) => {
  const item = cardFull.cards.filter(
    (e) => e.card_item_id == dataToModal.card_id
  )[0];
  const title = item.card_body.filter((e) => dataToModal.id == e.id_task)[0];
  return (
    <React.Fragment>
      <div className="modal-description-header-block-one">
        <div>
          <ListAltIcon />
        </div>
        <div
          onClick={() => {
            console.log(item);
          }}
        >
          <h2>{title.title}</h2>
        </div>
      </div>
      <p>In a collumn "{dataToModal.column}"</p>
      <p>
        Task Available for roles:{" "}
        {title.role.map((e, i) => {
          if (i == title.role.length - 1) {
            return (
              <span>
                {e.role}-{e.level}
              </span>
            );
          }
          return (
            <span>
              {e.role}-{e.level},{" "}
            </span>
          );
        })}
      </p>
    </React.Fragment>
  );
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { roleProfileInBoard, cardFull, activData },
}) => {
  return { token, roleProfileInBoard, cardFull, activData };
};

export default connect(mapStateToProps, null)(HeaderModalDescription);
