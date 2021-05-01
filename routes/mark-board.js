const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Board = require("../models/Board");
const Cards = require("../models/Cards");
const ObjectId = require("mongodb").ObjectId;

router.post("/", auth, async (req, res) => {
  try {
    const { board_id, email, newMarkBoard, state } = req.body;
    const board = await Board.find({ board_id });
    let boardOriginal = JSON.parse(JSON.stringify(board));

    const indexUser = board[0].addedUsers.findIndex((e) => e.email == email);

    if (state) {
      board[0].addedUsers[indexUser].marks = [
        ...board[0].addedUsers[indexUser].marks,
        newMarkBoard,
      ];
    }

    if (!state) {
      const indexMarkDelete = board[0].addedUsers[indexUser].marks.indexOf(
        newMarkBoard
      );
      console.log(indexMarkDelete);
      board[0].addedUsers[indexUser].marks = [
        ...board[0].addedUsers[indexUser].marks.slice(0, indexMarkDelete),
        ...board[0].addedUsers[indexUser].marks.slice(indexMarkDelete + 1),
      ];
    }

    await Board.updateOne(boardOriginal[0], board[0]);

    const indexValue = board[0].addedUsers.findIndex((e) => e.email == email);

    const marksCards = await Cards.find({
      card_id: board[0].addedUsers[indexValue].marks,
    });

    const marksCardsFilter = marksCards.map((e) => {
      return (e = {
        card_id: e.card_id,
        color: e.color,
        name_Board: e.name_Board,
      });
    });
    res.json({
      marksCards: marksCardsFilter,
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Something went wrong, try reload this page" });
  }
});

module.exports = router;
