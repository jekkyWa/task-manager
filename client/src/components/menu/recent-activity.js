import React from "react";
import { connect } from "react-redux";

const RecentActivity = ({ activData }) => {
  return (
    <p>
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
            </div>
          </div>
        );
      })}
    </p>
  );
};

const mapStateToProps = ({ reducerSaveData: { activData } }) => {
  return {
    activData,
  };
};

export default connect(mapStateToProps, null)(RecentActivity);
