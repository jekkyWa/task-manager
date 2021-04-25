const Cards = require("../../models/Cards");

module.exports = function (socket, io) {
  socket.on("addTask", async ({ data, dataActiv }) => {
    const { card_item_id, card_id, task } = data;

    const value = await Cards.find({ card_id });

    const filterItem = value[0].cards.filter(
      (e) => e.card_item_id === card_item_id
    );

    const newItem = {
      ...filterItem[0],
      card_body: [...filterItem[0].card_body, task],
    };

    value[0].cards = value[0].cards.map((e) => {
      return e.card_item_id === newItem.card_item_id ? newItem : e;
    });

    const originalValue = await Cards.find({ card_id });

    value[0].recentActivity = [...value[0].recentActivity, dataActiv];

    io.in(card_id).emit("newTask", { ...newItem });
    io.emit("newTaskActivity", value[0].recentActivity);

    await Cards.updateOne(originalValue[0], value[0]);
  });
};
