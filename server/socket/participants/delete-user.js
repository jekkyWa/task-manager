const Board = require("../../models/Board");
const User = require("../../models/User");

module.exports = function (socket, io) {
  socket.on("deleteUser", async ({ id, email }) => {
    const board = await Board.find({ board_id: id });
    const indexBoard = board[0].addedUsers.findIndex((e) => e.email == email);
    board[0].addedUsers = [
      ...board[0].addedUsers.slice(0, indexBoard),
      ...board[0].addedUsers.slice(indexBoard + 1),
    ];
    const boardOriginal = await Board.find({ board_id: id });

    const user = await User.find({ email });
    const indexUser = user[0].passive_rooms.indexOf(id);

    user[0].passive_rooms = [
      ...user[0].passive_rooms.slice(0, indexUser),
      ...user[0].passive_rooms.slice(indexUser + 1),
    ];
    const userOriginal = await User.find({ email });
    const filterRoomsActive = await Board.find({
      board_id: user[0].active_rooms,
    });

    const filterRoomsPassive = await Board.find({
      board_id: user[0].passive_rooms,
    });

    await Board.updateOne(boardOriginal[0], board[0]);
    await User.updateOne(userOriginal[0], user[0]);
    console.log(user[0].email);
    io.sockets.emit("getDataAfterDeleteUser", {
      board: board[0],
      user: user[0],
      active: filterRoomsActive,
      passive: filterRoomsPassive,
    });
  });
};
