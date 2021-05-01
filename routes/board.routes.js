const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Board = require("../models/Board");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;
const shortid = require("shortid");

router.post("/createBoard", auth, async (req, res) => {
  try {
    const {
      addedUsers,
      creator,
      date,
      description,
      id_board,
      nameProject,
    } = req.body;

    const board = new Board({
      name_Project: nameProject,
      description,
      date,
      addedUsers,
      board_id: id_board,
      creator,
    });

    const check = await User.find({
      email: { $in: addedUsers.map((e) => e.email) },
    });

    if (check.length !== addedUsers.length) {
      const errorEmail = addedUsers.filter((e) => {
        return check.map((e) => e.email).indexOf(e.email) == -1;
      });
      return res.status(500).json({
        message: `${
          errorEmail.length == 1 ? "User" : "Users"
        } with email: "${errorEmail.map((e) => e.email).join(", ")}" ${
          errorEmail.length == 1 ? "does not exist" : "do not exist"
        }`,
      });
    }

    await board.save();

    const value = await User.find({ _id: ObjectId(req.user.userId) });

    await User.updateOne(value[0], {
      ...value,
      active_rooms: [...value[0].active_rooms, id_board],
    });

    res.status(201).json({ message: "Board created" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

module.exports = router;
