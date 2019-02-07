var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
var Sentence = require("../models/Sentence.js");
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

// get a sentences by id
router.get("/:id", function (req, res, next) {
  Sentence.findById(req.params.id, function (err, sentence) {
    if (err) return next(err);
    res.json(sentence);
  });
});

// get a random sentence
router.get("/", function (req, res, next) {
  // console.log(req.session.userId)
  var userId = req.session.userId
  var notSeenSentences = Sentence.find({commentedBy: {$ne: userId}})
  notSeenSentences.countDocuments().exec(function (err, count) {
  // Sentence.countDocuments().exec(function (err, count) {  
    if (err) return next(err);
    // Get a random entry
    var random = Math.floor(Math.random() * count);
    // Query all sentences but only fetch one offset by our random
    notSeenSentences.findOne()
    // Sentence.findOne()
      .skip(random)
      .exec(function (err, randomSentence) {
        // if (err) return next(err);
        res.json(randomSentence);
      });
  });
});

// populate and update a sentence
router.put("/:id", function (req, res, next) {
  Sentence.findByIdAndUpdate(req.params.id, req.body)
    .populate("comments")
    .populate("commentedBy")
    .then(function (err, sentence) {
      // if (err) console.error(err)
      res.json(sentence);
    });
});


// export router as a module
module.exports = router;
