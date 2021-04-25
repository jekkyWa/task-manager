module.exports = function (socket) {
  socket.on("leaveImportantEvents", ({ id }) => {
    socket.leave(id + "important");
    console.log("A user left important events room: " + id);
  });
};
