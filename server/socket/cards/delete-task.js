const Cards = require("../../models/Cards");

module.exports = function (socket, io) {
  socket.on("deleteTask", async ({ id_board, id_card, id_task }) => {
    const value = await Cards.find({ card_id: id_board });
    const filterItem = value[0].cards.filter((e) => e.card_item_id === id_card);
    const indexItem = filterItem[0].card_body.findIndex((e) => {
      return e.id_task == id_task;
    });
    const newItem = {
      ...filterItem[0],
      card_body: [
        ...filterItem[0].card_body.slice(0, indexItem),
        ...filterItem[0].card_body.slice(indexItem + 1),
      ],
    };
    value[0].cards = value[0].cards.map((e) => {
      return e.card_item_id === newItem.card_item_id ? newItem : e;
    });
    const originalValue = await Cards.find({ card_id: id_board });
    io.in(id_board).emit("getDataAfterDelete", { body: newItem, id: id_task });
    await Cards.updateOne(originalValue[0], value[0]);
  });
};
