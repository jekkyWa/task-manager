import React, { useState } from "react";
import ModalAddImg from "../modal";
import Header from "../header";

const Page = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div>
      <Header />
      <p>Ваши проекты</p>
      <div>
        <p>У вас нет созданных проектов</p>
        <button onClick={() => setModalShow(true)}>Создать проект</button>
        <ModalAddImg show={modalShow} onHide={() => setModalShow(false)} />
      </div>
    </div>
  );
};

export default Page;
