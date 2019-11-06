const chai = require('chai')
let chaiHttp = require('chai-http');
const { expect } = chai;


chai.use(chaiHttp);
describe('check search ', function (done) {
    let res;
    this.timeout(5000);
    before(function (done) {
        chai.request('http://localhost:3003')
            .post('/search')
            .type('form')
            .send({
                'item': 'Egg',
                'cuisine': '',
                'name': ''
            })
            .end((err, response) => {
                res = response;
                done();
            })
    })

    it('check status', function () {
        expect(res).to.have.status(200);
    });
    it('check search details', (done) => {
        if (res.body.payload) {
            res.body.payload.map(s => {
                expect(s).haveOwnProperty('name');
            });
        }
        done();
    })
})
