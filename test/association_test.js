const mongoose = require('mongoose');
const assert = require('assert');
const Sentence = require('../models/Sentence');
const Comment = require('../models/Comment');
const User = require('../models/User');

describe('Associations', () => {
  let user, sentence, comment;


  beforeEach((done) => {
    user = new User({
      name: 'Ali'
    });
    sentence = new Sentence({
      title: 'JS is Great',
      content: 'Yep it really is'
    });
    comment = new Comment({
      content: 'Congrats on great post'
    });

    user.sentences.push(sentence);
    sentence.comments.push(comment);
    comment.user = user;

    Promise.all([user.save(), sentence.save(), comment.save()])
      .then(() => done());
  });

  it('saves a full relation graph', (done) => {
    User.findOne({
        name: 'Ali'
      })
      .populate({
        path: 'sentences',
        populate: {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then((user) => {
        assert(user.name === 'Ali');
        assert(user.sentences[0].title === 'JS is Great');
        assert(user.sentences[0].comments[0].content === 'Congrats on great post');
        assert(user.sentences[0].comments[0].user.name === 'Ali');

        done();
      });
  });
});