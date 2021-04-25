const Cards = require("../../models/Cards");
const Board = require("../../models/Board");

module.exports = function (socket, io) {
  socket.on("board", async ({ dataForSend, id }) => {
    const { name_Board, color, card_id, cards, board_id } = dataForSend;
    const board = new Cards({
      name_Board,
      color,
      card_id,
      board_id,
      cards,
    });

    io.in(id).emit("newBoard", {
      card_id,
      cards,
      color,
      name_Board,
    });

    await board.save();

    const value = await Board.find({ board_id: board_id });

    await Board.updateOne(value[0], {
      ...value,
      board_item: [...value[0].board_item, card_id],
    });
  });
};
