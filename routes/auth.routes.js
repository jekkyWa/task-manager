const { Router } = require("express");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const router = Router();
const jwt = require("jsonwebtoken");
const config = require("config");

//api/auth/register

router.post(
  "/register",
  [
    check("email", "Incorrect email").isEmail(),
    check("password", "Minimum password length 7 characters").isLength({
      min: 7,
    }),
    check("name", "You must fill in the field named").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: errors.errors[0].msg,
        });
      }

      const { email, password, name } = req.body;

      const candidate = await User.findOne({ email: email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Such a user already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
        name,
        active_rooms: [],
        passive_rooms: [],
        notifications: [],
      });
      await user.save();
      res.status(201).json({ message: "Пользователь создан" });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something went wrong, try again" });
    }
  }
);

//api/auth/login

router.post(
  "/login",
  [
    check("email", "Enter correct email").isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect data when entering the system",
        });
      }
      const { email, password } = req.body;
      console.log(email);
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User is not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Invalid password, try again" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "24h",
      });
      res.json({ token, userId: user.id });
    } catch (e) {
      res
        .status(500)
        .json({ message: "Something went wrong, try again" });
    }
  }
);

module.exports = router;
