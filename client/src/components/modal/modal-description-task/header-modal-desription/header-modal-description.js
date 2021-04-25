import React from "react";
// files
import "./header-modal-description.scss";
// material
import ListAltIcon from "@material-ui/icons/ListAlt";

const HeaderModalDescription = ({ dataToModal, cardFull }) => {
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
      <div className="info-about-task-modal-description">
        <p>
          In a collumn: <span>{dataToModal.column}</span>
        </p>
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
      </div>
    </React.Fragment>
  );
};

export default HeaderModalDescription;
