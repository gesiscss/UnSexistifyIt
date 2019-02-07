var express = require("express");
var router = express.Router();
var Feedback = require("../models/Feedback.js");

/* GET /feedbacks listing. */
router.get("/", function (req, res, next) {
  Feedback.find(function (err, feedbacks) {
    if (err) return next(err);
    res.json(feedbacks);
  });
});

// get a feedback by id
router.get("/:id", function (req, res, next) {
  Feedback.findById(req.params.id, function (err, feedback) {
    if (err) return next(err);
    res.json(feedback);
  });
});

/* POST /feedbacks */
router.post("/", function (req, res, next) {
  Feedback.create(req.body, function (err, feedback) {
    if (err) return next(err);
    res.json(feedback);
  });
});

/* PUT /feedbacks/:id */
router.put("/:id", function (req, res, next) {
  Feedback.findByIdAndUpdate(req.params.id, req.body, function (err, feedback) {
    if (err) return next(err);
    res.json(feedback);
  });
});

module.exports = router;