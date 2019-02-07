const assert = require('assert');
const request = require('supertest'); // to provide a high-level abstraction for testing HTTP
const mongoose = require('mongoose');
const app = require('../app');
const Sentence = mongoose.model('Sentence');

describe('Sentences controller', () => {

    it('POST to /sentences creates a new sentence', done => {
        Sentence.count().then(count => {
            request(app)
                .post('/sentences')
                .send({ description: 'a test sentence description' })
                .end(() => {
                    Sentence.count().then(newCount => {
                        assert(count + 1 === newCount);
                        done();
                    });
                });
        });
    });

    it('PUT to /sentences/id edits an existing sentence', done => {
        const sentence = new Sentence({ description: 'Sentence is going to be edited' });
        sentence.save().then(() => {
            request(app)
                .put(`/sentences/${sentence._id}`)
                .send({ description: 'Sentence is updated now' })
                .end(() => {
                    Sentence.findOne({ description: 'Sentence is updated now' })
                        .then(sentence => {
                            assert(sentence.description === 'Sentence is updated now');
                            done();
                        });
                });
        });
    });
    
    // it('DELETE to /sentences/id remove a sentence', done => {
    //     const sentence = new Sentence({ description: 'Sentence will be deleted' });
    //     sentence.save().then(() => {
    //         request(app)
    //             .delete(`/sentences/${sentence._id}`)
    //             .end(() => {
    //                 Sentence.findOne({ description: 'Sentence will be deleted' })
    //                     .then(sentence => {
    //                         assert(sentence === null);
    //                         done();
    //                     });
    //             });
    //     });
    // });
});