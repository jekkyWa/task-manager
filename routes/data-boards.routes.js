const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Card = require("../models/Cards");
const Board = require("../models/Board");

router.post("/getBoards", auth, async (req, res) => {
  try {
    const { board_id } = req.body;

    const value = await Board.find({ board_id });

    const filterCards = await Card.find({ card_id: value[0].board_item });

    res.json({
      filterCards: filterCards,
    });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
