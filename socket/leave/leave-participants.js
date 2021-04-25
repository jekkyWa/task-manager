module.exports = function (socket) {
  socket.on("leaveParticipants", ({ id }) => {
    socket.leave(id + "partic");
    console.log("A user left participants room : " + id + "partic");
  });
};
