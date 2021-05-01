const Board = require("../../models/Board");
const User = require("../../models/User");

module.exports = function (socket, io) {
  socket.on(
    "acceptOffer",
    async ({ id_notification, id_board, email, message, date }) => {
      console.log(id_notification, id_board, email, message);
      // Нужен: id доски, id уведомления, сообщение
      const user = await User.find({ email });
      const board = await Board.find({ board_id: id_board });

      let boardOriginal = JSON.parse(JSON.stringify(board));
      let userOriginal = JSON.parse(JSON.stringify(user));

      let indexNofication = user[0].notifications.findIndex(
        (e) => e.id_notification == id_notification
      );
      user[0].notifications = [
        ...user[0].notifications.slice(0, indexNofication),
        ...user[0].notifications.slice(indexNofication + 1),
      ];

      user[0].passive_rooms = [...user[0].passive_rooms, id_board];

      board[0].boards_activity = [
        ...board[0].boards_activity,
        { message, date, email },
      ];

      let indexUser = board[0].addedUsers.findIndex((e) => e.email == email);

      board[0].addedUsers[indexUser] = {
        ...board[0].addedUsers[indexUser],
        memberStatus: true,
      };

      await User.updateOne(userOriginal[0], user[0]);
      await Board.updateOne(boardOriginal[0], board[0]);

      const filterRoomsActive = await Board.find({
        board_id: user[0].active_rooms,
      });

      const filterRoomsPassive = await Board.find({
        board_id: user[0].passive_rooms,
      });

      socket.to(id_board + "partic").emit("getBoardWithNewUser", board[0]);
      io.in(email).emit("getAfterAcceptNotification", {
        user: user[0],
        rooms: {
          active: [...filterRoomsActive],
          passive: [...filterRoomsPassive],
        },
      });
    }
  );
};
