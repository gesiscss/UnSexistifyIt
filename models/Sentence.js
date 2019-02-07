const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

// create sentence schema
const SentenceSchema = new Schema({
  description: String,
  scale: Number,
  isSexist: Boolean,
  comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
  commentedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

const Sentence = mongoose.model("Sentence", SentenceSchema);

// create a model sentence
module.exports = Sentence;
