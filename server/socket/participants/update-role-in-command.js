const Board = require("../../models/Board");
const User = require("../../models/User");

module.exports = function (socket, io) {
  socket.on("updateRoleInCommand", async ({ id, email, data, message }) => {
    const board = await Board.find({ board_id: id });
    let boardOriginal = JSON.parse(JSON.stringify(board));
    const indexBoard = board[0].addedUsers.findIndex((e) => e.email == email);
    board[0].addedUsers[indexBoard].role = data;
    await Board.updateOne(boardOriginal[0], board[0]);
    await User.updateOne({ email }, { $push: { notifications: message } });

    io.emit("getUpdateRoleInCommand", { board: board[0] });
    socket.to(email).emit("getNotification", message);
    socket.to(email).emit("getNewRole", { role: data });
  });
};
