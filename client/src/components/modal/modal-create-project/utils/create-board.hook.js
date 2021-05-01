import shortid from "shortid";
import { useState } from "react";

export const useCreateBoard = () => {
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);
  const [error, setError] = useState(null);
  const [formCreateProject, setFormCreateProject] = useState({
    nameProject: "",
    description: "",
    date: "",
  });

  // Cleaning errors
  const clearError = () => setError(null);
  // handler option
  const onChangeOptionProject = (e) => {
    clearError();
    // If at least one input is empty, Button will be disabled
    let item = { ...formCreateProject, [e.target.name]: e.target.value };
    setFormCreateProject(item);

    if (
      item.nameProject.length !== 0 &&
      item.description.length !== 0 &&
      item.date.length !== 0
    ) {
      setValid(false);
    } else {
      setValid(true);
    }
  };

  // Creating a new board
  const createBoard = async (
    email,
    addedUsers,
    setAddedUsers,
    token,
    onHide,
    saveDataIdentification,
    socket,
    request
  ) => {
    try {
      if (addedUsers.findIndex((e) => e.emailOfUserToAdd == "") !== -1) {
        return setError(
          "You did not specify email to add a user, please enter the necessary data."
        );
      }
      // As soon as the function starts, will appear loading
      setLoading(true);
      //Generation id
      const id_notification = shortid.generate();
      let id_board = shortid.generate();
      // Preparation of data to send to the server
      let cleanAddedUsers = addedUsers
        .filter((e) => e.emailOfUserToAdd)
        .map((e) => {
          return {
            email: e.emailOfUserToAdd,
            role: e.roleOfUserToAdd,
            level: e.levelOfUserToAdd,
            memberStatus: false,
            marks: [],
          };
        });
      // End data
      let objForSend = {
        ...formCreateProject,
        addedUsers: [
          {
            email: email,
            role: "Product manager",
            level: "god",
            memberStatus: true,
            marks: [],
          },
          ...cleanAddedUsers,
        ],
        id_board,
        creator: email,
      };
      // Sending notifications about the team of users
      await socket.emit("sendNotification", {
        data: cleanAddedUsers,
        message: {
          title: `User "${email}" invites you to the team "${formCreateProject.nameProject}"`,
          type: "AddingToCommand",
          from: email,
          id_notification,
          id_board,
        },
      });
      // The main request for the server to create a new board
      await request("/api/createBoard", "POST", objForSend, {
        Authorization: `Bearer ${token}`,
      });
      const data = await request("/api/getData/test", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      clearError();
      //Saving all data, complete download and output from the modal window
      saveDataIdentification(data.email, data.name, data.rooms);
      setLoading(false);
      setAddedUsers([]);
      setFormCreateProject({ nameProject: "", description: "", date: "" });
      onHide();
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return {
    createBoard,
    loading,
    onChangeOptionProject,
    setFormCreateProject,
    formCreateProject,
    valid,
    error,
    clearError,
  };
};
