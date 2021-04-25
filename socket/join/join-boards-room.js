const Cards = require("../../models/Cards");
const Board = require("../../models/Board");

module.exports = function (socket) {
  socket.on("joinroom", async ({ id, email }) => {
    console.log("join room to the boards " + id);
    console.log(socket.rooms.size);
    socket.join(id);
    const value = await Board.find({ board_id: id });
    const indexValue = value[0].addedUsers.findIndex((e) => e.email == email);
    const filterCards = await Cards.find({ card_id: value[0].board_item });
    const marksCards = await Cards.find({
      card_id: value[0].addedUsers[indexValue].marks,
    });
    const lastItem = marksCards.map(
      (e) =>
        (e = {
          card_id: e.card_id,
          color: e.color,
          name_Board: e.name_Board,
        })
    );
    socket.emit("getBoard", { filterCards, marksCards: lastItem });
  });
};
