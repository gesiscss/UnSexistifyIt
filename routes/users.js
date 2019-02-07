const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

/* GET /users listing. */
router.get("/", function(req, res, next) {
  User.find(function(err, users) {
    if (err) return next(err);
    res.json(users);
  });
});


// get guests
router.get("/guests", function(req, res, next) {
  User.find({
    username: /Guest/i
  }).exec(function(err, guests) {
    if (err) return next(error);
    res.json(guests);
  });
});


// Profile
router.get('/profile', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  res.json({
    user: req.user
  })
});


// Register
router.post('/register', (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.json({
      success: false,
      msg: 'Please pass username and password.'
    });
  } else {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
      if (err) {
        console.log(err)
        res.json({
          success: false,
          msg: newUser.username + ' is already taken. Try again!'
        });
      } else {
        res.json({
          success: true,
          msg: 'New user has been registered.'
        });
      }
    });
  }
});

// Login Authenticate
router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) {
      console.log(err)
      throw err;
    }
    if (!user) {
      return res.json({
        success: false,
        msg: 'User not found!'
      });
    }
    req.session.userId = user._id;
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        console.log(err)
        throw err;
      }
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT' + token,
          user: {
            id: user._id,
            username: user.username,
            password: user.password
          }
        });
      } else {
        return res.json({
          success: false,
          msg: 'Authentication failed. Wrong password.'
        });
      }
    });
  });
});


/* GET /users/username */
// router.get("/:username", function(req, res, next) {
//   User.findOne({
//     username: req.params.username
//   }).exec(function(err, user) {
//     if (err) return next(error);
//     if (user) {
//       req.session.userId = user._id;
//     }
//     res.json(user);
//     return next();
//   });
// });


router.get("/:username", function(req, res, next) {
  const username = req.params.username;
  if (!isNaN(parseInt(username))) { // <------ Check if it's an ID
    next();
  } else {
    User.findOne({
      username: req.params.username
    }).exec(function(err, user) {
      if (user) {
        req.session.userId = user._id;
      }
      if (err) return next(error);
      res.json(user);
    });
  }
});

/* GET /users/id */
router.get("/:id", function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) return next(err);
    res.json(user);
  });
});


// populate and update a comment
router.put("/:username", function(req, res, next) {
  const username = req.params.username;
  if (!isNaN(parseInt(username))) {
    next();
  } else {
    User.findOneAndUpdate({
        username: req.params.username
      }, req.body)
      .populate("comments")
      .populate("ratedOn")
      .then(function(err, user) {
        res.json(user);
      });
  }
});

/* PUT /users/:id */
router.put("/:id", function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, req.body, function(err, user) {
    if (err) return next(err);
    res.json(user);
  });
});

// post /users/username
router.post("/:username", function(req, res, next) {
  User.findOne({
    username: req.params.username
  }).exec(function(err, user) {
    if (err) return next(error);
    req.session.userId = user._id;
    res.json(user);
  });
});


/* POST /users */
router.post("/", function(req, res, next) {
  User.create(req.body, function(err, user) {
    if (err) return next(err);
    req.session.userId = user._id;
    res.json(user);
  });
});


// /* DELETE /users/:id */
// router.delete("/:id", function (req, res, next) {
//   User.findByIdAndRemove(req.params.id, req.body, function (err, user) {
//     if (err) return next(err);
//     res.json(user);
//   });
// });


module.exports = router;