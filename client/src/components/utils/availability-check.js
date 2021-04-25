export const availCheck = (value, card, roleProfileInBoard) => {
  console.log(value);
  const id = value.card_item_id;
  const newCardsItem = [
    ...card.cards.slice(
      0,
      card.cards.findIndex((e) => e.card_item_id === id)
    ),
    value,
    ...card.cards.slice(card.cards.findIndex((e) => e.card_item_id == id) + 1),
  ];
  const newItem = { ...card, cards: newCardsItem };
  const filterTaskRole = newItem.cards.map((e) => {
    return {
      ...e,
      card_body: e.card_body.filter((elem) => {
        const statusProfile = (status) => {
          return status == "Senior" ? 3 : status == "Middle" ? 2 : 1;
        };
        return (
          (elem.role.findIndex(
            (element) => element.role == roleProfileInBoard.role
          ) !== -1 &&
            elem.role.findIndex(
              (element) =>
                statusProfile(element.level) <=
                statusProfile(roleProfileInBoard.level)
            ) !== -1) ||
          roleProfileInBoard.role == "Product manager"
        );
      }),
    };
  });
  newItem.cards = filterTaskRole;
  return newItem;
};
