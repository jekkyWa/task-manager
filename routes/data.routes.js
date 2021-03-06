const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const Board = require("../models/Board");
const ObjectId = require("mongodb").ObjectId;

router.get("/test", auth, async (req, res) => {
  try {
    const value = await User.find({ _id: ObjectId(req.user.userId) });

    const filterRooms = await Board.find({ board_id: value[0].active_rooms });

    res.json({
      email: value[0].email,
      name: value[0].name,
      active_rooms: filterRooms,
    });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
