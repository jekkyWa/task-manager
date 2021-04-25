import React from "react";
import { connect } from "react-redux";
import "./recent-activity.scss";

const RecentActivity = ({ activData }) => {
  return (
    <div className="recent-activity-body-main">
      {activData.map((e, i) => {
        return (
          <div
            onClick={() => {
              console.log(e);
            }}
            key={i}
            className="activity-item"
          >
            <div className="icon-profile-recent-activity">
              <p> {e.email[0]}</p>
            </div>
            <div className="сommentators-info">
              <p>{e.message}</p>
              <p className="date-сommentators-info">{e.date}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = ({ reducerSaveData: { activData } }) => {
  return {
    activData,
  };
};

export default connect(mapStateToProps, null)(RecentActivity);
