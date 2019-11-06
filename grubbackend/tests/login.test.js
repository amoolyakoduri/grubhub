const chai = require('chai')
let chaiHttp = require('chai-http');
const { expect } = chai;


chai.use(chaiHttp);
describe('check Login ', function (done) {
    let res;
    this.timeout(5000);
    before(function (done) {
        chai.request('http://localhost:3003')
            .post('/login')
            .type('form')
            .send({
                'emailId': 'h@gmail.com',
                'password': "2510c39011c5be704182423e3a695e91"
            })
            .end((err, response) => {
                res = response;
                done();
            })
    })

    it('check status', function () {
        expect(res).to.have.status(200);
    });
    it('check cookie', (done) => {
        expect(res).to.have.cookie('loggedIn')
        done();
    })
})
