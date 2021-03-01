const { Router } = require("express");
const router = Router();
const User = require("../models/User");

router.get("/emailAndPassword", (req, res) => {
  try {
    User.find().then((value) => res.status(201).json(value));
  } catch (e) {
    throw new Error(e);
  }
});

module.exports = router;
