const assert = require('assert');
const request = require('supertest'); // to provide a high-level abstraction for testing HTTP
const app = require('../app');

// watch for incoming request of method GET
// to the route http://localhost:3000
describe('The express app', () => {
    it('handles a GET request', (done) => {
        request(app)
            .get('/')
            .end((err, response) => {
                assert(response.status === 200)
                done()
            });
    });
});