import React, { useEffect, useState } from "react";
import Header from "../header";
import SideBar from "../sideBar/side-bar";
import { useParams } from "react-router-dom";
import { saveImportantEvents } from "../../action/action-login";
import { connect } from "react-redux";
import "./important-events.scss";
import Loading from "../loading/loading";
import { useHistory } from "react-router-dom";
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard";
import ViewAgendaTwoToneIcon from "@material-ui/icons/ViewAgendaTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const ImportantEvents = ({ socket, saveImportantEvents, importantEvents }) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (socket) {
      socket.on("getBoardForImportantEvents", (value) => {
        saveImportantEvents(value);
        setLoading(false);
      });
    }
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      socket.emit("joinImportantEvents", { id: id.slice(id.length - 10) });
    }
    return () =>
      socket.emit("leaveImportantEvents", { id: id.slice(id.length - 10) });
  }, [id, socket]);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  const labelMainActivity = importantEvents.board[0].boards_activity.map(
    (e, i) => {
      return (
        <div key={i} className="board-activity-important-events">
          <h1>{e.message}</h1>
          <h2>{e.date}</h2>
        </div>
      );
    }
  );

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
        {cardActivity}
      </div>
    );
  });

  return (
    <div>
      <Header />
      <div className="container participants-page">
        <div>
          <SideBar />
        </div>
        <div className="participants">
          <div className="submeni-important-events">
            <div className="card-name-important-events">
              <div className="left-text-important-events">
                <DeveloperBoardIcon fontSize="small" />
                <h1>Recent Board Actions </h1>
              </div>
              <div>
                <ExpandMoreIcon fontSize="small" />
              </div>
            </div>
          </div>
          {labelMainActivity}
          {labelCardActivity}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ getDataReducer: { socket, importantEvents } }) => {
  return { socket, importantEvents };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveImportantEvents: (importantEvents) => {
      dispatch(saveImportantEvents(importantEvents));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportantEvents);
