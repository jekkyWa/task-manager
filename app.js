const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");
// join
const {
  joinNotification,
  joinMainPageBoard,
  joinBoardsRoom,
  joinParticipants,
  joinImportantEvents,
  joinCard,
} = require("./socket/join");
// leave
const {
  leaveImportantEvents,
  leaveBoard,
  leaveCard,
  leaveParticipants,
} = require("./socket/leave");
// command
const { exitCommand, deleteCommand } = require("./socket/command");
// participiants
const {
  addAdditionalUser,
  deleteUser,
  updateLevelInCommand,
  updateRoleInCommand,
} = require("./socket/participants");
// cards
const {
  deleteCheckListItem,
  changeStatusListItem,
  addCheckListItem,
  addCheckList,
  changeRole,
  rename,
  deleteTask,
  completedTask,
  refuseAssignment,
  addComment,
  addUserToDo,
  addDescriptionToTask,
  addTask,
  addCard,
} = require("./socket/cards");
// board
const { board } = require("./socket/board");
// notifications
const {
  acceptOffer,
  refuseOffer,
  sendNotification,
  readedNotification,
} = require("./socket/notifications");

mongoose.connect(config.get("mongoUri"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();

app.use(express.json({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200,
  })
);

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/getData", require("./routes/data.routes"));

app.use("/api/", require("./routes/board.routes"));

app.use("/api/addMark", require("./routes/mark-board"));

app.use("/api/addMarkMainBoards", require("./routes/marks-boards"));

const PORT = config.get("port") || 5000;

const server = app.listen(PORT, () =>
  console.log(`App has been started on ${PORT}`)
);

let io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.id);

  socket.on("setUserId", (email) => {
    console.log("join" + email);
    socket.join(email);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.id);
    console.log(socket.rooms.size);
  });

  // Connect to Commander with Notifications
  joinNotification(socket);
  // Getting all boards
  joinMainPageBoard(socket);
  // Connect to the room with board
  joinBoardsRoom(socket);
  // Connecting to the room with participants
  joinParticipants(socket);
  // Connect to the room important events
  joinImportantEvents(socket);
  // Connect to the room cards
  joinCard(socket);

  // Out of room "important events"
  leaveImportantEvents(socket);
  // Exit from the room "Board"
  leaveBoard(socket);
  // Exit from the room "Card"
  leaveCard(socket);
  // Exit from the room "Participants"
  leaveParticipants(socket);

  // Deleting a team
  deleteCommand(socket);
  // Coming from the team
  exitCommand(socket);

  // Send notification
  sendNotification(socket, io);
  // Refusal to participate in the team
  refuseOffer(socket, io);
  // Agree to participate in the team
  acceptOffer(socket, io);
  // Accept notification
  readedNotification(socket, io);

  // Adding a new User to Board
  addAdditionalUser(socket, io);
  // Delete User in Board
  deleteUser(socket, io);
  // Update the role of user in Command
  updateRoleInCommand(socket, io);
  // Update the level of user in Command
  updateLevelInCommand(socket, io);

  // Remove subtask
  deleteCheckListItem(socket, io);
  // Change the status of the leaf check element
  changeStatusListItem(socket, io);
  // Add Check List item
  addCheckListItem(socket, io);
  // Add Check List
  addCheckList(socket, io);
  // Change roles for task
  changeRole(socket, io);
  // Rename the task
  rename(socket, io);
  // Delete task
  deleteTask(socket, io);
  // Completion of the task
  completedTask(socket, io);
  // Refuse to task
  refuseAssignment(socket, io);
  // Adding a comment
  addComment(socket, io);
  // Additional opportunities to take a task
  addUserToDo(socket, io);
  // Adding a description
  addDescriptionToTask(socket, io);
  // Adding a new task
  addTask(socket, io);
  // Add a new card
  addCard(socket, io);

  // Adding a new board
  board(socket, io);
});
