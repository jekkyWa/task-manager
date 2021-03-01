import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./modal-create-project.scss";

const ModalCreateProject = (props) => {
  const [addUser, setAddUser] = useState([]);

  let label = addUser.map((e) => {
    return (
      <div>
        <p>Email</p>
        <input />
        <p>Role in the project</p>
        <input />
        <button
          onClick={() => {
            setAddUser([...addUser.slice(0, e), ...addUser.slice(e + 1, 0)]);
          }}
        >
          delete
        </button>
      </div>
    );
  });

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h1 className="title-modal">Create a project(board)</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h2>The name of the project</h2>
          <input type="textarea" />
          <h2>Description of the project</h2>
          <input type="textarea" />
          <h2>Estimated completion date of the project</h2>
          <input type="textarea" />
        </div>
        <div>
          <button
            onClick={() => {
              setAddUser([...addUser, addUser.length]);
            }}
          >
            Add user
          </button>
          {label}
        </div>
        <button>Create a project</button>
        <button>Clear form</button>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateProject;
