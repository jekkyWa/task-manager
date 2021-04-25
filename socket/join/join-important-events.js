const Cards = require("../../models/Cards");
const Board = require("../../models/Board");

module.exports = function (socket) {
  socket.on("joinImportantEvents", async ({ id }) => {
    console.log("Join Important Events " + id + "partic");
    console.log(socket.rooms.size);
    socket.join(id + "important");
    const board = await Board.find({ board_id: id });
    const card = await Cards.find({ card_id: board[0].board_item });
    socket.emit("getBoardForImportantEvents", { board: board, card: card });
  });
};
