const Cards = require("../../models/Cards");

module.exports = function (socket, io) {
  socket.on("rename", async ({ id_board, id_card, id_task, data }) => {
    // Поиск нужного элемента в БД
    const value = await Cards.find({ card_id: id_board });
    // Ищем нужную карточку
    const filterCardItem = value[0].cards.filter(
      (e) => e.card_item_id == id_card
    )[0];
    // Ищем нужный Task
    const filterItem = filterCardItem.card_body.filter(
      (e) => e.id_task == id_task
    );
    // Обновляем элемент
    const newItem = {
      ...filterItem[0],
      title: data,
    };
    // Находим нужный индекс task
    const index = filterCardItem.card_body.findIndex(
      (e) => e.id_task == id_task
    );
    // Обновляем card_body
    filterCardItem.card_body[index] = newItem;
    // Находим index карточки
    const indexCard = value[0].cards.findIndex(
      (e) => e.card_item_id == id_card
    );
    // Конечное обновление элемента БД
    value[0].cards[indexCard] = filterCardItem;
    // Оригинальный элемент без изменений
    const originalValue = await Cards.find({ card_id: id_board });

    io.emit("getRenameData", value[0]);

    await Cards.updateOne(originalValue[0], value[0]);
  });
};
