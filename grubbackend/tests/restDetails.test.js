const chai = require('chai')
let chaiHttp = require('chai-http');
const { expect } = chai;


chai.use(chaiHttp);
describe('check restaurants ', function(done){
    let res;
    this.timeout(5000);
    before(function(done){
        chai.request('http://localhost:3003')
        .get('/getRestDetails/21')
        .type('form')
        .end((err, response) => {
            res = response;
            done();
        })
    })

    it('check status', function(){
        expect(res).to.have.status(200);
    });
    it('check restaurant details', (done) =>{
        if(res.body.payload && res.body.payload.restDetails) {
            expect(res.body.payload.restDetails).haveOwnProperty('name');
        }
        done();
    })
})
