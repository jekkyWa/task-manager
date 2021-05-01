const Board = require("../../models/Board");
const User = require("../../models/User");

module.exports = function (socket, io) {
  socket.on("addAdditionalUser", async ({ board_id, data, message }) => {
    const value = await Board.find({ board_id });
    let boardOriginal = JSON.parse(JSON.stringify(value));
    const user = await User.find({ email: data.email });
    await console.log("user", user);
    if (user.length == 0) {
      return socket.emit("getNewUsers", {
        error: `User with email: "${data.email}" does not exist`,
      });
    }
    await User.updateOne(
      { email: data.email },
      { $push: { notifications: message } }
    );
    value[0].addedUsers = [...value[0].addedUsers, data];
    await Board.updateOne(boardOriginal[0], value[0]);

    io.in(board_id + "partic").emit("getNewUsers", value[0]);
  });
};
