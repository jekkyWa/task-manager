const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;

router.get("/test", auth, async (req, res) => {
  try {
    const links = await User.find({ _id: ObjectId(req.user.userId) });
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
