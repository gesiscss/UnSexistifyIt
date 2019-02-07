const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

const FeedbackSchema = new Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  position: String,
  age: Number,
  clear: Number,
  difficult: Number,
  intersting: Number,
  challenging: Number,
  design: Number,
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;
