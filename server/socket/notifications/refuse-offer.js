const Board = require("../../models/Board");
const User = require("../../models/User");

module.exports = function (socket, io) {
  socket.on(
    "refuseOffer",
    async ({ id_notification, id_board, email, message, date }) => {
      // Нужен: id доски, id уведомления, сообщение, добавить запись в БД
      const user = await User.find({ email });
      const board = await Board.find({ board_id: id_board });

      let boardOriginal = JSON.parse(JSON.stringify(board));
      let userOriginal = JSON.parse(JSON.stringify(user));

      let indexNotification = user[0].notifications.findIndex(
        (e) => e.id_notification == id_notification
      );

      user[0].notifications = [
        ...user[0].notifications.slice(0, indexNotification),
        ...user[0].notifications.slice(indexNotification + 1),
      ];

      board[0].boards_activity = [
        ...board[0].boards_activity,
        { message, date },
      ];
      let indexBoard = board[0].addedUsers.findIndex((e) => e.email == email);

      board[0].addedUsers = [
        ...board[0].addedUsers.slice(0, indexBoard),
        ...board[0].addedUsers.slice(indexBoard + 1),
      ];

      await User.updateOne(userOriginal[0], user[0]);
      await Board.updateOne(boardOriginal[0], board[0]);

      socket.to(id_board + "partic").emit("getBoardWithNewUser", board[0]);
      io.in(email).emit("getAfterRefuseNotification", user[0].notifications);
    }
  );
};
