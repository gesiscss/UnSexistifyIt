const mongoose = require('mongoose');

before (done => {
    mongoose.connect('mongodb://localhost/game_test');
    mongoose.connection
        .once('open', () =>  done())
        .on('error', err => {
            console.error('Error!', err);
        });
});

beforeEach(done => {
    const { sentences } = mongoose.connection.collections;
    sentences.drop()
        .then(() => done())
        .catch(() => done());
});
