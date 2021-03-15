const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Board = require("../models/Board");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;
const shortid = require("shortid");

router.post("/createBoard", auth, async (req, res) => {
  try {
    const { nameProject, description, date, addedUsers } = req.body;

    let id = shortid.generate();

    const board = new Board({
      name_Project: nameProject,
      description,
      date,
      addedUsers,
      board_id: id,
    });

    const check = await User.find(
      { email: { $in: addedUsers.map((e) => e.email) } },
      function (err, data) {}
    );

    if (check.length !== addedUsers.length) {
      const errorEmail = addedUsers.filter((e) => {
        return check.map((e) => e.email).indexOf(e.email) == -1;
      });
      res.status(500).json({
        message: `${errorEmail
          .map((e) => e.email)
          .join(", ")} не существует(ют)`,
      });
    }

    await board.save();

    const value = await User.find({ _id: ObjectId(req.user.userId) });

    await User.updateOne(value[0], {
      ...value,
      active_rooms: [...value[0].active_rooms, id],
    });

    await User.updateMany(
      { email: { $in: addedUsers.map((e) => e.email) } },
      { $addToSet: { passive_rooms: [id] } }
    );

    res.status(201).json({ message: "Доска создана" });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
