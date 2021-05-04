const Cards = require("../../models/Cards");

module.exports = function (socket, io) {
  socket.on("addCard", async ({ data, id, dataActiv, roleBack, levelBack }) => {
    const value = await Cards.find({ card_id: id });
    value[0].cards = [...value[0].cards, data];
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
    value[0].recentActivity = [...value[0].recentActivity, dataActiv];
    const notFilter = await Cards.find({ card_id: id });
    notFilter[0].cards = [...notFilter[0].cards, data];
    notFilter[0].recentActivity = [...notFilter[0].recentActivity, dataActiv];
    const originalValue = await Cards.find({ card_id: id });
    io.in(id).emit("getCardItem", {
      filterCards: value[0],
      original: notFilter[0],
    });
    io.in(id).emit("getCardActivity", value[0].recentActivity);
    await Cards.updateOne(originalValue[0], notFilter[0]);
  });
};
