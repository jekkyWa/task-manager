import React, { useState } from "react";
import ModalAddImg from "../modal";
import Header from "../header";
import "./pages.scss";

const Page = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="main-page">
      <Header />
      <p>Your projects</p>
      <div className="none-project">
        <p>You have no projects created</p>
        <button onClick={() => setModalShow(true)}>Create a project</button>
        <ModalAddImg show={modalShow} onHide={() => setModalShow(false)} />
      </div>
    </div>
  );
};

export default Page;
