const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.middleware");
const Board = require("../models/Board");
const ObjectId = require("mongodb").ObjectId;
const shortid = require("shortid");

router.post("/test", auth, async (req, res) => {
  try {
    const { nameProject, description, date, addedUsers } = req.body;

    let id = shortid.generate()

    const board = new Board({
      nameProject,
      description,
      date,
      addedUsers,
      id
    });

  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
