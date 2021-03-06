const { Schema, model, Types } = require("mongoose");

const shema = new Schema({
  board_id: { type: String },
  name_Project: { type: String },
  description: { type: String },
  date: { type: String },
  addedUsers: [],
  task: [],
});

module.exports = model("Board", shema);
