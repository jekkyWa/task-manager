const Cards = require("../../models/Cards");
const Board = require("../../models/Board");
const User = require("../../models/User");

module.exports = function (socket) {
  socket.on("deleteCommand", async ({ board_id }) => {
    const value = await Board.find({ board_id });
    const dataActive = await User.find({ active_rooms: board_id });
    const indexActive = dataActive[0].active_rooms.indexOf(board_id);
    await User.updateOne(dataActive[0], {
      active_rooms: [
        ...dataActive[0].active_rooms.slice(0, indexActive),
        ...dataActive[0].active_rooms.slice(indexActive + 1),
      ],
    });
    await User.updateMany(
      { passive_rooms: board_id },
      {
        $pull: { passive_rooms: board_id },
      }
    );
    await Cards.deleteMany({ card_id: value[0].board_item });
    await Board.deleteOne({ board_id });
  });
};
