const Board = require("../../models/Board");
const User = require("../../models/User");

module.exports = function (socket, io) {
  socket.on(
    "updateLevelInCommand",
    async ({ id, email, movement, currentState, message }) => {
      let activeLevel;
      const board = await Board.find({ board_id: id });
      let boardOriginal = JSON.parse(JSON.stringify(board));
      const indexBoard = board[0].addedUsers.findIndex((e) => e.email == email);
      const levelArr = ["Junior", "Middle", "Senior"];
      if (movement == "up" && currentState !== 2) {
        board[0].addedUsers[indexBoard].level = levelArr[currentState + 1];
        activeLevel = levelArr[currentState + 1];
      }
      if (movement == "down" && currentState !== 0) {
        board[0].addedUsers[indexBoard].level = levelArr[currentState - 1];
        activeLevel = levelArr[currentState - 1];
      }
      if (JSON.stringify(board) !== JSON.stringify(boardOriginal)) {
        await Board.updateOne(boardOriginal[0], board[0]);
        await User.updateOne({ email }, { $push: { notifications: message } });
        io.emit("getUpdateLevelInCommand", { board: board[0] });
        socket.to(email).emit("getNotification", message);
        socket.to(email).emit("getNewLevel", { level: activeLevel });
      }
    }
  );
};
