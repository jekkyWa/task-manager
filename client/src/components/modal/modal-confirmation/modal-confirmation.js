import React from "react";
import { Modal } from "react-bootstrap";
// files
import "./modal-confirmation.scss";
// redux
import { connect } from "react-redux";

const ModalConfirmation = ({ show, onHide, dataForDelete, socket }) => {
  const deleteUser = () => {
    socket.emit("deleteUser", {
      id: dataForDelete.id,
      email: dataForDelete.email,
    });
    // Close a window
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-40w" centered>
      <Modal.Body>
        <div className="modal-confirmation">
          <h1>
            Are you sure you want to delete the user from the team, user Loses
            all data tied to this team?
          </h1>
          <div className="modal-confirmation-btns">
            <button onClick={deleteUser} className="delete-modal-confirmation">
              Delete
            </button>
            <button className="close-modal-confirmation" onClick={onHide}>
              Close
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = ({ reducerSaveData: { socket } }) => {
  return { socket };
};

export default connect(mapStateToProps, null)(ModalConfirmation);
