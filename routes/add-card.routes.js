const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Board = require("../models/Board");
const User = require("../models/User");
const shortid = require("shortid");
const Cards = require("../models/Cards");

router.post("/addTask", auth, async (req, res) => {
  try {
    const { card_item_id, card_id, task } = req.body;

    const value = await Cards.find({ card_id });

    const filterItem = value[0].cards.filter(
      (e) => e.card_item_id === card_item_id
    );

    const newItem = {
      ...filterItem[0],
      card_body: [...filterItem[0].card_body, task],
    };

    console.log("newItem", value);

    await Cards.updateOne(value[0], {
      ...value,
      cards: value[0].cards.map((e) => {
        return e.card_item_id === newItem.card_item_id ? newItem : e;
      }),
    });

    res.status(201).json({ message: "Данные обновлены" });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
