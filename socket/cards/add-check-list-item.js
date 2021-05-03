const Cards = require("../../models/Cards");

module.exports = function (socket, io) {
  socket.on(
    "addCheckListItem",
    async ({ id_board, id_card, id_task, data }) => {
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
      const newItem = {
        ...filterItem[0],
        check_letter: {
          list: [...filterItem[0].check_letter.list, data],
          availability: filterItem[0].check_letter.availability,
        },
      };
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
      io.in(id_board).emit("getCheckListItem", value[0]);
      await Cards.updateOne(originalValue[0], value[0]);
    }
  );
};
