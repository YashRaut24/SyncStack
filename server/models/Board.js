const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
});

const boardSchema = new mongoose.Schema({
  boardId: { type: String, required: true, unique: true },
  columns: [columnSchema],
});

module.exports = mongoose.model("Board", boardSchema);