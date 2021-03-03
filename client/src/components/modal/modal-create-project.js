import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./modal-create-project.scss";
import shortid from "shortid";

const ModalCreateProject = (props) => {
  const [addUser, setAddUser] = useState([]);

  let label = addUser.map((e, i) => {
    return (
      <div key={e} className="add-user-block">
        <div className="add-user-email">
          <p>Email</p>
          <input />
        </div>
        <div className="add-user-role">
          <p>Role in the project</p>
          <select className="test">
            <option>Back-end developer</option>
            <option>Front-end developer</option>
            <option>QA</option>
            <option>Business Analyst</option>
            <option>UX/UI designer</option>
            <option>Marketing specialist</option>
            <option>Product manager</option>
          </select>
        </div>
        <div className="add-user-role">
          <p>Level</p>
          <select className="test">
            <option>Junior</option>
            <option>Middle</option>
            <option>Senior</option>
          </select>
        </div>
        <div className="add-user-delete-btn">
          <button
            onClick={() => {
              setAddUser([...addUser.slice(0, i), ...addUser.slice(i + 1)]);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  useEffect(() => {
    console.log(addUser);
  }, [addUser]);

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h1 className="title-modal">Create a project(board)</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="body-modal">
          <h2>The name of the project</h2>
          <input type="textarea" />
          <h2>Description of the project</h2>
          <input type="textarea" />
          <h2>Estimated completion date of the project</h2>
          <input type="textarea" />
        </div>
        <div className="body-modal-add-user">
          <button
            onClick={() => {
              setAddUser([...addUser, shortid.generate()]);
            }}
          >
            Add user
          </button>
          {label}
        </div>
        <button className="create-proj-btn">Create a project</button>
        <button className="clear-form-btn" onClick={() => setAddUser([])}>
          Clear form
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateProject;
