module.exports = function (socket) {
  socket.on("leaveRoom", ({ id }) => {
    socket.leave(id);
    console.log("A user left board room: " + id);
  });
};
