import React, { useState } from "react";
import Header from "../header";
import ModalAddBoard from "../modal-add-board/modal-add-board";
import SideBar from "../sideBar/side-bar";
import "./pages.scss";

const BoardPage = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div>
      <Header />
      <div className="container boards-page">
        <div>
          <SideBar />
        </div>
        <div className="boards-body">
          <div className="board" onClick={() => setModalShow(true)}>
            <p>Create a board</p>
          </div>
          <ModalAddBoard show={modalShow} onHide={() => setModalShow(false)} />
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
