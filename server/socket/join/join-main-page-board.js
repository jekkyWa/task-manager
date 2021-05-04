const Cards = require("../../models/Cards");
const Board = require("../../models/Board");
const User = require("../../models/User");

module.exports = function (socket) {
  socket.on("joinMainPageBoard", async ({ email }) => {
    console.log("joinMainPageBoard");
    const value = await User.find({ email: email });
    const command = value[0].active_rooms.concat(value[0].passive_rooms);
    const boards = await Board.find({ board_id: command });
    const marksId = boards
      .map((e, i) => {
        const index = e.addedUsers.findIndex((e) => e.email == email);
        return (e = {
          items: e.addedUsers[index].marks,
          board_id: e.board_id,
          name: e.name_Project,
        });
      })
      .flat();

    for (let i = 0; i < marksId.length; i++) {
      marksId[i].items = await Cards.find({ card_id: marksId[i].items });
      const lastItem = marksId[i].items.map(
        (e) =>
          (e = {
            card_id: e.card_id,
            color: e.color,
            name_Board: e.name_Board,
            board_id: marksId[i].board_id,
            name: marksId[i].name,
          })
      );
      marksId[i] = lastItem;
    }

    // активные карточки
    const boardsActive = await Board.find({ board_id: value[0].active_rooms });
    const cardsActive = boardsActive.map((e) => {
      return (e = {
        items: e.board_item,
        board_id: e.board_id,
        name: e.name_Project,
      });
    });
    for (let i = 0; i < cardsActive.length; i++) {
      cardsActive[i].items = await Cards.find({
        card_id: cardsActive[i].items,
      });
    }
    // пассивные карточки
    const boardsPassive = await Board.find({
      board_id: value[0].passive_rooms,
    });
    const cardsPassive = boardsPassive.map((e) => {
      return (e = {
        items: e.board_item,
        board_id: e.board_id,
        name: e.name_Project,
      });
    });
    for (let i = 0; i < cardsPassive.length; i++) {
      cardsPassive[i].items = await Cards.find({
        card_id: cardsPassive[i].items,
      });
    }

    socket.emit("getDataMainPageBoard", {
      marks: marksId.flat(),
      cards: { active: cardsActive, passive: cardsPassive },
    });
  });
};
