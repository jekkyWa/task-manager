const User = require("../../models/User");

module.exports = function (socket) {
  socket.on("joinNotification", async ({ email }) => {
    console.log("joooooin");
    const value = await User.find({ email: email });
    socket.emit("getNotifications", value[0].notifications);
  });
};
