const Board = require("../../models/Board");

module.exports = function (socket, io) {
  socket.on("updateRoleInCommand", async ({ id, email, data }) => {
    const board = await Board.find({ board_id: id });
    let boardOriginal = JSON.parse(JSON.stringify(board));
    const indexBoard = board[0].addedUsers.findIndex((e) => e.email == email);
    board[0].addedUsers[indexBoard].role = data;
    await Board.updateOne(boardOriginal[0], board[0]);

    io.emit("getUpdateRoleInCommand", { board: board[0] });
  });
};
