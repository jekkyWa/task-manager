const Board = require("../../models/Board");

module.exports = function (socket, io) {
  socket.on(
    "updateLevelInCommand",
    async ({ id, email, movement, currentState }) => {
      const board = await Board.find({ board_id: id });
      let boardOriginal = JSON.parse(JSON.stringify(board));
      const indexBoard = board[0].addedUsers.findIndex((e) => e.email == email);
      const levelArr = ["Junior", "Middle", "Senior"];
      if (movement == "up" && currentState !== 2) {
        board[0].addedUsers[indexBoard].level = levelArr[currentState + 1];
      }
      if (movement == "down" && currentState !== 0) {
        board[0].addedUsers[indexBoard].level = levelArr[currentState - 1];
      }
      if (JSON.stringify(board) !== JSON.stringify(boardOriginal)) {
        await Board.updateOne(boardOriginal[0], board[0]);
        io.emit("getUpdateLevelInCommand", { board: board[0] });
      }
    }
  );
};
