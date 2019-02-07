const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)

const CommentSchema = new Schema({
	content: String,
	commentScore: Number,
	rateScore: {
        type: Number,
        default: 0
    },
	commentedOn: {
		type: Schema.Types.ObjectId,
		ref: "Sentence"
	},
	postedBy: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	rating: [{
		rate: Number,
		ratedBy: {
			type: Schema.Types.ObjectId,
			ref: "User"
		}
	}],
	timeSpent: Number
	// rating: [Number ],
	// ratedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;