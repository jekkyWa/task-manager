import React, { useState } from "react";
import ViewAgendaTwoToneIcon from "@material-ui/icons/ViewAgendaTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const LabelCardActivity = ({ importantEvents }) => {
  const labelCardActivity = importantEvents.card.map((e, i) => {
    const cardActivity = e.recentActivity.map((element, index) => {
      return (
        <div className="card-activity-important-events">
          <h1>{element.email}</h1>
          <h2> {element.message}</h2>
          <h3>{element.date}</h3>
        </div>
      );
    });
    return (
      <div>
        <div className="submeni-important-events">
          <div className="card-name-important-events">
            <div className="left-text-important-events">
              <ViewAgendaTwoToneIcon fontSize="small" />
              <h1>Recent Card Actions: "{e.name_Board}" </h1>
            </div>
            <div>
              <ExpandMoreIcon fontSize="small" />
            </div>
          </div>
        </div>
        <div>{cardActivity}</div>
      </div>
    );
  });
  return labelCardActivity;
};

export default LabelCardActivity;
