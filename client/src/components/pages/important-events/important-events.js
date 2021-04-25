import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// files
import Header from "../../header";
import SideBar from "../../sideBar/side-bar";
import "./important-events.scss";
import Loading from "../../loading/loading-main/loading";
import LabelMainActivity from "./blocks/label-main-activity";
// redux
import { saveImportantEvents } from "../../../action/action-save-date";
import { connect } from "react-redux";
// material
import DeveloperBoardIcon from "@material-ui/icons/DeveloperBoard";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LabelCardActivity from "./blocks/label-card-activity";

const ImportantEvents = ({ socket, saveImportantEvents, importantEvents }) => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  // Get data
  useEffect(() => {
    if (socket) {
      socket.on("getBoardForImportantEvents", (value) => {
        saveImportantEvents(value);
        setLoading(false);
      });
    }
  }, [id, socket]);

  // Connect to command "important events"
  useEffect(() => {
    if (socket) {
      socket.emit("joinImportantEvents", { id: id.slice(id.length - 10) });
      return () =>
        socket.emit("leaveImportantEvents", { id: id.slice(id.length - 10) });
    }
  }, [id, socket]);

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container important-events">
        <div>
          <SideBar />
        </div>
        <div className="important-events-body">
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
          <LabelMainActivity importantEvents={importantEvents} />
          <LabelCardActivity importantEvents={importantEvents} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ reducerSaveData: { socket, importantEvents } }) => {
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
