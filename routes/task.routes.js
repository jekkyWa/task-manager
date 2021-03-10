const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Board = require("../models/Board");
const Card = require("../models/Cards");
// const shortid = require("shortid");

router.post("/createCard", auth, async (req, res) => {
  try {
    const { name_Board, color, card_id, cards } = req.body;

    const card = new Card({
      name_Board,
      color,
      card_id,
      board_id,
      cards,
    });

    await card.save();

    const value = await Board.find({ board_id });

    await User.updateOne(value[0], {
      ...value,
      board_item: [...value[0].board_item, card_id],
    });
    res.status(201).json({ message: "Доска с карточками создана" });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так" });
  }
});

module.exports = router;
