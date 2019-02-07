const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.js");
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

// get a random comment
router.get("/randomcomment/", function (req, res, next) {
  var userId = req.session.userId
  var notSeenComments = Comment.find({ 'rating.ratedBy': {$ne: userId}, postedBy: {$ne: userId} })
  notSeenComments.countDocuments().exec(function (err, count) {
  // Comment.countDocuments().exec(function (err, count) {
    if (err) console.error(err);
    var random = Math.floor(Math.random() * count);
    notSeenComments.findOne()
    // Comment.findOne()
      .skip(random)
      .exec(function (err, randomComment) {
        // if (err) return next(err);
        res.json(randomComment);
      });
  });
});

// populate and update a comment
router.put("/randomcomment/:id", function (req, res, next) {
  Comment.findByIdAndUpdate(req.params.id, req.body)
    .populate("rating")
    // .populate("ratedBy")
    .then(function (err, comment) {
      // if (err) return next(err);
      if (err) console.error(err);
      res.json(comment);
    });
});

/* GET /comments listing. */
router.get("/", function (req, res, next) {
  Comment.find(function (err, comments) {
    if (err) return next(err);
    res.json(comments);
  });
});

// get a comment by id
router.get("/:id/", function (req, res, next) {
  Comment.findById(req.params.id, function (err, comment) {
    if (err) return next(err);
    res.json(comment);
  });
});

/* POST /comments */
router.post("/", function (req, res, next) {
  Comment.create(req.body, function (err, comment) {
    if (err) return next(err);
    res.json(comment);
  });
});


// populate and update a comment
router.put("/:id/", function (req, res, next) {
  Comment.findByIdAndUpdate(req.params.id, req.body)
    .populate("commentedOn")
    .populate("postedBy")
    .then(function (err, comment) {
      if (err) return next(err);
      res.json(comment);
    });
});


// export router as a module
module.exports = router;
