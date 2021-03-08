import React from "react";
import Header from "../header";
import SideBar from "../sideBar/side-bar";
import "./pages.scss";

const BoardPage = () => {
  return (
    <div>
      <Header />
      <div className="container boards-page">
        <div>
          <SideBar />
        </div>
        <div className="boards-body">
          <div className="board">
            <p>Create a board</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
