const Board = require("../../models/Board");

module.exports = function (socket) {
  socket.on("joinParticipants", async ({ id }) => {
    console.log("Join Participants " + id + "partic");
    console.log(socket.rooms.size);
    socket.join(id + "partic");
    const value = await Board.find({ board_id: id });
    socket.emit("getRightBoard", value[0]);
  });
};
