const Cards = require("../../models/Cards");

module.exports = function (socket) {
  socket.on("joinCard", async ({ id, roleBack, levelBack }) => {
    console.log("Join_CARD", id);
    socket.join(id);

    const value = await Cards.find({ card_id: id });
    // Obtaining data
    const filterTaskRole = value[0].cards.map((e) => {
      return {
        ...e,
        card_body: e.card_body.filter((elem) => {
          const statusProfile = (status) => {
            return status == "Senior" ? 3 : status == "Middle" ? 2 : 1;
          };
          return (
            (elem.role.findIndex((element) => element.role == roleBack) !==
              -1 &&
              elem.role.findIndex(
                (element) =>
                  statusProfile(element.level) <= statusProfile(levelBack)
              ) !== -1) ||
            roleBack == "Product manager"
          );
        }),
      };
    });

    value[0].cards = filterTaskRole;

    // Обычное получение данных
    const originalValue = await Cards.find({ card_id: id });

    socket.emit("getCard", { filterCards: value, original: originalValue });
  });
};
