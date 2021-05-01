const User = require("../../models/User");

module.exports = function (socket) {
  socket.on("readedNotification", async ({ id_notification, email }) => {
    const user = await User.find({ email });

    let userOriginal = JSON.parse(JSON.stringify(user));

    let indexNotification = user[0].notifications.findIndex(
      (e) => e.id_notification == id_notification
    );
    console.log();

    user[0].notifications = [
      ...user[0].notifications.slice(0, indexNotification),
      ...user[0].notifications.slice(indexNotification + 1),
    ];

    await User.updateOne(userOriginal[0], user[0]);
    socket.emit("getAfterReadedNotification", user[0].notifications);
  });
};
