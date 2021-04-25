const Board = require("../../models/Board");
const User = require("../../models/User");

module.exports = function (socket, io) {
  socket.on("addAdditionalUser", async ({ board_id, data, message }) => {
    const value = await Board.find({ board_id });
    value[0].addedUsers = [...value[0].addedUsers, data];
    const orgiginalValue = await Board.find({ board_id });

    await Board.updateOne(orgiginalValue[0], value[0]);

    await User.updateOne(
      { email: data.email },
      { $push: { notifications: message } }
    );
    io.in(board_id + "partic").emit("getNewUsers", value[0]);
  });
};
