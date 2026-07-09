const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  boardId: { type: String, required: true },
  columnId: { type: String, required: true },
  title: { type: String, required: true },
});

module.exports = mongoose.model("Card", cardSchema);