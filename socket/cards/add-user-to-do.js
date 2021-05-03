const Cards = require("../../models/Cards");

module.exports = function (socket, io) {
  socket.on(
    "addUserToDo",
    async ({ id_board, id_card, id_task, data, dataActiv }) => {
      // Search for the desired element in the database
      const value = await Cards.find({ card_id: id_board });
      // We are looking for the desired card
      const filterCardItem = value[0].cards.filter(
        (e) => e.card_item_id == id_card
      )[0];
      // We are looking for the necessary task
      const filterItem = filterCardItem.card_body.filter(
        (e) => e.id_task == id_task
      );
      // Update item
      const newItem = { ...filterItem[0], nameOfTaker: data };
      // Find the desired Task index
      const index = filterCardItem.card_body.findIndex(
        (e) => e.id_task == id_task
      );
      // Update Card_Body
      filterCardItem.card_body[index] = newItem;
      // We find index cards
      const indexCard = value[0].cards.findIndex(
        (e) => e.card_item_id == id_card
      );
      // End update of the database element
      value[0].cards[indexCard] = filterCardItem;
      // Original element without changes
      const originalValue = await Cards.find({ card_id: id_board });
      value[0].recentActivity = [...value[0].recentActivity, dataActiv];
      io.in(id_board).emit("newUserToDo", value[0]);
      io.in(id_board).emit("taskTake", value[0].recentActivity);
      await Cards.updateOne(originalValue[0], value[0]);
    }
  );
};
