import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./modal-create-project.scss";
import { saveDataIdentification } from "../../action/action-login";
import shortid from "shortid";
import { useHttp } from "../hooks/http.hook";
import { connect } from "react-redux";

const ModalCreateProject = ({
  onHide,
  show,
  token,
  active_rooms,
  saveDataIdentification,
}) => {
  const [addedUsers, setAddedUsers] = useState([]);

  const { request } = useHttp();

  const [formCreateProject, setFormCreateProject] = useState({
    nameProject: "",
    description: "",
    date: "",
  });

  const onChangeOptionProject = (e) => {
    setFormCreateProject({
      ...formCreateProject,
      [e.target.name]: e.target.value,
    });
  };

  const createBord = async () => {
    try {
      let cleanAddedUsers = addedUsers.map((e) => {
        return {
          email: e.emailOfUserToAdd,
          role: e.roleOfUserToAdd,
          level: e.levelOfUserToAdd,
        };
      });
      let objForSend = {
        ...formCreateProject,
        addedUsers: cleanAddedUsers,
      };
      await request("/api/createBoard", "POST", objForSend, {
        Authorization: `Bearer ${token}`,
      });
      const data = await request("/api/getData/test", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      saveDataIdentification(data.email, data.name, data.active_rooms);
    } catch (e) {
      console.error(e);
    }
  };

  let label = addedUsers.map((element, i) => {
    const changeHandlerAddUser = (e) => {
      const id = addedUsers.findIndex((e) => e.id == element.id);
      let newItem = {
        ...addedUsers[id],
        emailOfUserToAdd:
          e.target.name == "emailOfUserToAdd"
            ? e.target.value
            : addedUsers[id].emailOfUserToAdd,
        roleOfUserToAdd:
          e.target.name == "roleOfUserToAdd"
            ? e.target.value
            : addedUsers[id].roleOfUserToAdd,
        levelOfUserToAdd:
          e.target.name == "levelOfUserToAdd"
            ? e.target.value
            : addedUsers[id].levelOfUserToAdd,
      };
      setAddedUsers([
        ...addedUsers.slice(0, id),
        newItem,
        ...addedUsers.slice(id + 1),
      ]);
    };
    return (
      <div key={element.id} className="add-user-block">
        <div className="add-user-email">
          <p>Email</p>
          <input
            id={element.id}
            name="emailOfUserToAdd"
            onChange={changeHandlerAddUser}
          />
        </div>
        <div className="add-user-role">
          <p>Role in the project</p>
          <select
            name="roleOfUserToAdd"
            onChange={changeHandlerAddUser}
            id={element.id}
          >
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
          <select
            name="levelOfUserToAdd"
            onChange={changeHandlerAddUser}
            id={element.id}
          >
            <option>Junior</option>
            <option>Middle</option>
            <option>Senior</option>
          </select>
        </div>
        <div className="add-user-delete-btn">
          <button
            onClick={() => {
              setAddedUsers([
                ...addedUsers.slice(0, i),
                ...addedUsers.slice(i + 1),
              ]);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  const { nameProject, description, date } = formCreateProject;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          <h1 className="title-modal">Create a project(board)</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="body-modal">
          <h2>The name of the project</h2>
          <input
            onChange={onChangeOptionProject}
            name="nameProject"
            type="textarea"
            value={nameProject}
          />
          <h2>Description of the project</h2>
          <input
            onChange={onChangeOptionProject}
            name="description"
            type="textarea"
            value={description}
          />
          <h2>Estimated completion date of the project</h2>
          <input
            onChange={onChangeOptionProject}
            name="date"
            type="textarea"
            value={date}
          />
        </div>
        <div className="body-modal-add-user">
          <button
            onClick={() => {
              setAddedUsers([
                ...addedUsers,
                {
                  emailOfUserToAdd: "",
                  roleOfUserToAdd: "Back-end developer",
                  levelOfUserToAdd: "Junior",
                  id: shortid.generate(),
                },
              ]);
            }}
          >
            Add user
          </button>
          {label}
        </div>
        <button
          className="create-proj-btn"
          onClick={() => {
            createBord();
          }}
        >
          Create a project
        </button>
        <button
          className="clear-form-btn"
          onClick={() => {
            setAddedUsers([]);
            setFormCreateProject({
              nameProject: "",
              description: "",
              date: "",
            });
          }}
        >
          Clear form
        </button>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = ({
  loginReducer: { token },
  getDataReducer: { active_rooms },
}) => {
  return { token, active_rooms };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataIdentification: (email, name, active_rooms) => {
      dispatch(saveDataIdentification(email, name, active_rooms));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateProject);
