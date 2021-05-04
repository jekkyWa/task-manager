module.exports = function (socket) {
  socket.on("leaveRoomCard", ({ id }) => {
    socket.leave(id);
    console.log("A user left card room: " + id);
  });
};
