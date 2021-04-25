const Board = require("../../models/Board");

module.exports = function (socket) {
  socket.on("exitCommand", async ({ board_id, email }) => {
    const value = await Board.find({ board_id });
  });
};
