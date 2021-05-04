const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Board = require("../models/Board");
const Cards = require("../models/Cards");
const User = require("../models/User");

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
      board[0].addedUsers[indexUser].marks = [
        ...board[0].addedUsers[indexUser].marks.slice(0, indexMarkDelete),
        ...board[0].addedUsers[indexUser].marks.slice(indexMarkDelete + 1),
      ];
    }

    console.log("Выполнение - 1");

    await Board.updateOne(boardOriginal[0], board[0]);

    const value = await User.find({ email: email });
    const command = value[0].active_rooms.concat(value[0].passive_rooms);

    const boards = await Board.find({ board_id: command });
    const marksId = boards
      .map((e, i) => {
        const index = e.addedUsers.findIndex((e) => e.email == email);
        return (e = {
          items: e.addedUsers[index].marks,
          board_id: e.board_id,
          name: e.name_Project,
        });
      })
      .flat();

    for (let i = 0; i < marksId.length; i++) {
      marksId[i].items = await Cards.find({ card_id: marksId[i].items });
      const lastItem = marksId[i].items.map(
        (e) =>
          (e = {
            card_id: e.card_id,
            color: e.color,
            name_Board: e.name_Board,
            board_id: marksId[i].board_id,
            name: marksId[i].name,
          })
      );
      marksId[i] = lastItem;
    }
    res.json({
      marksCards: marksId.flat(),
    });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
