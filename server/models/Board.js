const { Schema, model, Types } = require("mongoose");

const shema = new Schema({
  board_id: { type: String },
  name_Project: { type: String },
  description: { type: String },
  date: { type: String },
  addedUsers: [],
  board_item: [],
  boards_activity: [],
  creator: { type: String },
});

module.exports = model("Board", shema);
