import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import shortid from "shortid";
// filex
import "./modal-create-project.scss";
import { useHttp } from "../../hooks/http.hook";
import { useCreateBoard } from "./utils/create-board.hook";
import image_2 from "../../../images/modal-create-project.svg";
import AddedUsers from "./blocks/added-users";
// redux
import { saveDataIdentification } from "../../../action/action-identfication-data";
import { connect } from "react-redux";

const ModalCreateProject = ({
  onHide,
  show,
  token,
  email,
  saveDataIdentification,
  socket,
}) => {
  const [addedUsers, setAddedUsers] = useState([]);

  // Using third-party hukov
  const { request } = useHttp();
  const {
    createBoard,
    onChangeOptionProject,
    formCreateProject,
  } = useCreateBoard();

  // Adding a new string to fill
  const createNewUser = () => {
    setAddedUsers([
      ...addedUsers,
      {
        emailOfUserToAdd: "",
        roleOfUserToAdd: "Back-end developer",
        levelOfUserToAdd: "Junior",
        id: shortid.generate(),
      },
    ]);
  };

  const { nameProject, description, date } = formCreateProject;

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-100w">
      <Modal.Body>
        <div>
          <div className="main-content-modal-create-project">
            <div className="body-modal">
              <div className="slogan-modal-create-project">
                <h1>Create a workspace</h1>
                <h2>
                  Increase productivity: team members will be able to receive
                  Convenient access to all boards.
                </h2>
              </div>
              <h2>The name of the project</h2>
              <input
                onChange={onChangeOptionProject}
                name="nameProject"
                type="textarea"
                value={nameProject}
                placeholder={`Title of the project "Kyuby"`}
              />
              <h3>Specify the name of your team, company or organization.</h3>
              <h2>Estimated completion date of the project</h2>
              <input
                onChange={onChangeOptionProject}
                name="date"
                type="textarea"
                value={date}
                placeholder={`For example "22.01.2020"`}
              />
              <h2>Description of the project</h2>
              <textarea
                className="description-input-modal-create-project"
                onChange={onChangeOptionProject}
                name="description"
                type="text"
                placeholder="Here your team stores all the necessary information."
                value={description}
              />
              <h3>Tell me the participants a little about the workspace.</h3>
              <div className="body-modal-add-user">
                <button onClick={createNewUser}>
                  Add users to your project, сlick me!
                </button>
                <AddedUsers
                  addedUsers={addedUsers}
                  setAddedUsers={setAddedUsers}
                />
              </div>
              <button
                className="create-proj-btn"
                onClick={() => {
                  createBoard(
                    email,
                    addedUsers,
                    token,
                    onHide,
                    saveDataIdentification,
                    socket,
                    request
                  );
                }}
              >
                Create a project
              </button>
            </div>
            <div className="img-modal-create-project">
              <img src={image_2} />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = ({
  reducerDataIdentification: { rooms, email },
  loginReducer: { token },
  reducerSaveData: { socket },
}) => {
  return { token, rooms, email, socket };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDataIdentification: (email, name, rooms) => {
      dispatch(saveDataIdentification(email, name, rooms));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateProject);
