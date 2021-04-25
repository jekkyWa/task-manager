const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");
// join
const joinNotification = require("./socket/join/join-notifications");
const joinMainPageBoard = require("./socket/join/join-main-page-board");
const joinBoardsRoom = require("./socket/join/join-boards-room");
const joinParticipants = require("./socket/join/join-participants");
const joinImportantEvents = require("./socket/join/join-important-events");
const joinCard = require("./socket/join/join-card");
// leave
const leaveImportantEvents = require("./socket/leave/leave-important-events");
const leaveBoard = require("./socket/leave/leave-board");
const leaveCard = require("./socket/leave/leave-card");
const leaveParticipants = require("./socket/leave/leave-participants");
// command
const exitCommand = require("./socket/command/exit-command");
const deleteCommand = require("./socket/command/delete-command");
// participiants
const addAdditionalUser = require("./socket/participants/add-additional-user");
const deleteUser = require("./socket/participants/delete-user");
const updateLevelInCommand = require("./socket/participants/update-level-in-command");
const updateRoleInCommand = require("./socket/participants/update-role-in-command");
// cards
const deleteCheckListItem = require("./socket/cards/delete-check-list-item");
const changeStatusListItem = require("./socket/cards/change-status-list-item");
const addCheckListItem = require("./socket/cards/add-check-list-item");
const addCheckList = require("./socket/cards/add-check-list");
const changeRole = require("./socket/cards/change-role");
const rename = require("./socket/cards/rename");
const deleteTask = require("./socket/cards/delete-task");
const completedTask = require("./socket/cards/completed-task");
const refuseAssignment = require("./socket/cards/refuse-assignment");
const addComment = require("./socket/cards/add-comment");
const addUserToDo = require("./socket/cards/add-user-to-do");
const addDescriptionToTask = require("./socket/cards/add-description-to-task");
const addTask = require("./socket/cards/add-task");
const addCard = require("./socket/cards/add-card");
// board
const board = require("./socket/board/board");
// notifications
const acceptOffer = require("./socket/notifications/accept-offer");
const refuseOffer = require("./socket/notifications/refuse-offer");
const sendNotification = require("./socket/notifications/send-notifications");
// Key-meaning (email - socket)
let _users = {};

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
    _users[email] = socket.id;
    console.log(_users);
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
  sendNotification(socket, _users);
  // Refusal to participate in the team
  refuseOffer(socket, _users, io);
  // Agree to participate in the team
  acceptOffer(socket, _users, io);

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
