const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Board = require("../models/Board");
const Cards = require("../models/Cards");
const ObjectId = require("mongodb").ObjectId;

router.post("/", auth, async (req, res) => {
  try {
    const { board_id, email, newMarkBoard, state } = req.body;
    console.log(board_id, email, newMarkBoard, state);
    const board = await Board.find({ board_id });
    let boardOriginal = JSON.parse(JSON.stringify(board));

    const indexUser = board[0].addedUsers.findIndex((e) => e.email == email);

    console.log(indexUser);

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

    res.json({
      marksCards: marksCards,
    });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
