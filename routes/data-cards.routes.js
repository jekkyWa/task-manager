const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Card = require("../models/Cards");
const Board = require("../models/Board");

router.post("/getCard", auth, async (req, res) => {
  try {
    const { card_id } = req.body;

    const value = await Card.find({ card_id });

    res.json({
      filterCard: value,
    });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
