const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const Board = require("../models/Board");
const ObjectId = require("mongodb").ObjectId;

router.get("/", auth, async (req, res) => {
  try {
    const value = await User.find({ _id: ObjectId(req.user.userId) });

    res.json({
      notification: value[0].notifications,
    });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
