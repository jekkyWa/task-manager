import React from "react";
// files
import "./recent-activity.scss";

const RecentActivity = ({ activData }) => {
  const label = activData.map((e, i) => {
    return (
      <div key={i} className="activity-item">
        <div className="icon-profile-recent-activity">
          <p> {e.email[0]}</p>
        </div>
        <div className="сommentators-info">
          <p>{e.message}</p>
          <p className="date-сommentators-info">{e.date}</p>
        </div>
      </div>
    );
  });
  return <div className="recent-activity-body-main">{label}</div>;
};

export default RecentActivity;
