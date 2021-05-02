import React, { useState } from "react";
import ViewAgendaTwoToneIcon from "@material-ui/icons/ViewAgendaTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const LabelCardActivity = ({ importantEvents }) => {
  const [arr, setArr] = useState([]);
  const labelCardActivity = importantEvents.card.map((e, i) => {
    const cardActivity = e.recentActivity.map((element, index) => {
      return (
        <div key={index} className="card-activity-important-events">
          <h1>{element.email}</h1>
          <h2> {element.message}</h2>
          <h3>{element.date}</h3>
        </div>
      );
    });
    const changeDisplay = () => {
      const indexDisplay = arr.indexOf(i);
      if (indexDisplay == -1) {
        return setArr((prev) => [...prev, i]);
      }
      setArr((prev) => [
        ...prev.slice(0, indexDisplay),
        ...prev.slice(indexDisplay + 1),
      ]);
    };
    return (
      <div key={i}>
        <div className="submeni-important-events">
          <div className="card-name-important-events">
            <div className="left-text-important-events">
              <ViewAgendaTwoToneIcon fontSize="small" />
              <h1>Recent Card Actions: "{e.name_Board}" </h1>
            </div>
            <div>
              <KeyboardArrowUpIcon
                fontSize="small"
                onClick={changeDisplay}
                className={
                  arr.indexOf(i) !== -1
                    ? "hidden"
                    : "expand-more-icon-imp-events"
                }
              />
              <ExpandMoreIcon
                fontSize="small"
                onClick={changeDisplay}
                className={
                  arr.indexOf(i) == -1
                    ? "hidden"
                    : "expand-more-icon-imp-events"
                }
              />
            </div>
          </div>
        </div>
        <div className={arr.indexOf(i) !== -1 ? "hidden" : ""}>
          {cardActivity}
        </div>
      </div>
    );
  });
  return labelCardActivity;
};

export default LabelCardActivity;
