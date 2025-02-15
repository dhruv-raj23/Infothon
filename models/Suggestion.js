const mongoose = require("mongoose");

const SuggestionSchema = new mongoose.Schema({
  suggestion: {
    type: String,
    required: true,
  }
  // timestamp: {
  //   type: Date,
  //   default: Date.now,
  // },
},
{
  timestamps: true
});

module.exports = mongoose.model("Suggestion", SuggestionSchema);
