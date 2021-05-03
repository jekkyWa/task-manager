const User = require("../../models/User");

module.exports = function (socket, io) {
  socket.on("sendNotification", async ({ data, message }) => {
    for (let i = 0; i < data.length; i++) {
      await User.updateOne(
        { email: data[i].email },
        { $push: { notifications: message } }
      );
      io.to(data[i].email).emit("getNotification", message);
    }
  });
};
