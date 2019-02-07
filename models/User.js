const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)


// User Model
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    commentScore: {
        type: Number,
        default: 0
    },
    rateScore: {
        type: Number,
        default: 0
    },
    totalScore: {
        type: Number,
        default: 0
    },
    isGuest: {
        type: Boolean,
        default: false
    },
    userIP: {
        type: String,
        default: 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    ratedOn: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    round: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    skipped: {
        type: Number,
        default: 0
    },
    isContinued: {
        type: Boolean,
        default: false
    }
});

const User = module.exports = mongoose.model("User", UserSchema);

// Retrieves user data by ID
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

// Retrieves user data by Username
module.exports.getUserByUsername = function(username, callback) {
    const query = {
        username: username
    }
    User.findOne(query, callback);
}

// Adds user to the database
module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
                console.log(err)
                throw err;
            }
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

// Compare password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}