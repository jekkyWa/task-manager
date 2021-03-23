const { Schema, model, Types } = require("mongoose");

const shema = new Schema({
  card_id: { type: String },
  name_Board: { type: String },
  cards: { type: Array },
  color: { type: String },
  recentActivity: [],
});

module.exports = model("Cards", shema);
