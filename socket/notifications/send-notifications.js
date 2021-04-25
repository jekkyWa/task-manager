const User = require("../../models/User");

module.exports = function (socket, _users) {
  socket.on("sendNotification", async ({ data, message }) => {
    for (let i = 0; i < data.length; i++) {
      await User.updateOne(
        { email: data[i].email },
        { $push: { notifications: message } }
      );
      if (_users[data[i].email]) {
        socket.to(_users[data[i].email]).emit("getNotification", [message]);
      }
    }
  });
};
