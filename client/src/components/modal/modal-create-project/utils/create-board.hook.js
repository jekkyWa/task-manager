import shortid from "shortid";
import { useState } from "react";

export const useCreateBoard = () => {
  const [loading, setLoading] = useState(false);
  const onChangeOptionProject = (e) => {
    setFormCreateProject({
      ...formCreateProject,
      [e.target.name]: e.target.value,
    });
  };

  const [formCreateProject, setFormCreateProject] = useState({
    nameProject: "",
    description: "",
    date: "",
  });

  // Creating a new board
  const createBoard = async (
    email,
    addedUsers,
    token,
    onHide,
    saveDataIdentification,
    socket,
    request
  ) => {
    try {
      // As soon as the function starts, will appear loading
      setLoading(true);
      //Generation id
      const id_notification = shortid.generate();
      let id_board = shortid.generate();
      // Preparation of data to send to the server
      let cleanAddedUsers = addedUsers.map((e) => {
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
      // The main request for the server to create a new board
      await request("/api/createBoard", "POST", objForSend, {
        Authorization: `Bearer ${token}`,
      });
      const data = await request("/api/getData/test", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      //Saving all data, complete download and output from the modal window
      saveDataIdentification(data.email, data.name, data.rooms);
      setLoading(false);
      onHide();

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
    } catch (e) {
      console.error(e);
    }
  };
  return { createBoard, loading, onChangeOptionProject, formCreateProject };
};
