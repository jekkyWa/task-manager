const { Schema, model, Types } = require("mongoose");

const shema = new Schema({
  board_id: { type: Number },
  descriptions: [],
  task: [],
});

module.exports = model("User", shema);
