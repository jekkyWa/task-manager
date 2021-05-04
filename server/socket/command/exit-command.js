const Board = require("../../models/Board");
const User = require("../../models/User");

module.exports = function (socket, io) {
  socket.on("exitCommand", async ({ board_id, email }) => {
    const board = await Board.find({ board_id });
    const user = await User.find({ email });
    let boardOriginal = JSON.parse(JSON.stringify(board));
    let userOriginal = JSON.parse(JSON.stringify(user));
    const index = board[0].addedUsers.findIndex((e) => e.email == email);
    board[0].addedUsers = [
      ...board[0].addedUsers.slice(0, index),
      ...board[0].addedUsers.slice(index + 1),
    ];
    const indexPassive = user[0].passive_rooms.indexOf(board_id);
    user[0].passive_rooms = [
      ...user[0].passive_rooms.slice(0, indexPassive),
      ...user[0].passive_rooms.slice(indexPassive + 1),
    ];
    await User.updateOne(userOriginal[0], user[0]);
    await Board.updateOne(boardOriginal[0], board[0]);
    const active = await Board.find({ board_id: user[0].active_rooms });
    const passive = await Board.find({ board_id: user[0].passive_rooms });
    io.to(board_id + "partic").emit("getUsersAfterExit", board[0]);
    socket.emit("getDataAfterExit", {
      active,
      passive,
      update: false,
    });
  });
};
