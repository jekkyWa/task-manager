import React, { useEffect } from "react";
import Header from "../header";
import SideBar from "../sideBar/side-bar";
import { connect } from "react-redux";

const BoardsMainPage = ({ socket, email }) => {
  useEffect(() => {
    if (socket) {
      socket.emit("joinMainPageBoard", { email: email });
    }
  }, [email, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("getDataMainPageBoard", (value) => {
        console.log(value);
      });

      return () => socket.off("getDataMainPageBoard");
    }
  }, [socket]);
  return (
    <div>
      <Header />
      <div className="container participants-page">
        <div>
          <SideBar />
        </div>
        <div className="participants"></div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ getDataReducer: { socket, email } }) => {
  return { socket, email };
};

//   const mapDispatchToProps = (dispatch) => {
//     return {
//       saveImportantEvents: (importantEvents) => {
//         dispatch(saveImportantEvents(importantEvents));
//       },
//     };
//   };

export default connect(mapStateToProps, null)(BoardsMainPage);
