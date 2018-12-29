let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var server = require("../server.js")
var db = require("../database.js")

chai.use(chaiHttp);

var BEARER_TOKEN = null
var USER_ID = null


describe('Tests', () => {

    let userInfo = {
        name : "test4",
        email: "test4@example.com",
        password: "test123456"
    }

    describe('Login test', () => {
        it('It should login and get a new token', (done) => {
            let loginInfo = {
                user: "admin@example.com",
                password: "admin123456"
            }
            chai.request(server)
                .post('/api/auth/login')
                .send(loginInfo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    BEARER_TOKEN = (res.body.data.token)
                done();
                });
        });
  
    });

    describe('Login check', () => {
        it('It should get session info', (done) => {
            chai.request(server)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer '+BEARER_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                done();
                });
        });
  
    });

    describe('User create', () => {
        
        it('It should create a new user', (done) => {
            
            db.run("DELETE FROM user where email = ?",userInfo.email)
            chai.request(server)
                .post('/api/user/')
                .set('Authorization', 'Bearer '+BEARER_TOKEN)
                .send(userInfo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    USER_ID = (res.body.data.id)
                done();
                });
        });
  
    });

    describe('User update', () => {
        
        it('It should update an existing user', (done) => {
            let userInfo = {
                name : "Test user",
            }
            chai.request(server)
                .patch('/api/user/'+USER_ID)
                .set('Authorization', 'Bearer '+BEARER_TOKEN)
                .send(userInfo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.name.should.be.eql(userInfo.name);
                done();
                });
        });
  
    });

    describe('User get', () => {
        it('It should get user info', (done) => {
            chai.request(server)
                .get('/api/user/' + USER_ID)
                .set('Authorization', 'Bearer '+BEARER_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.id.should.be.eql(USER_ID);
                done();
                });
        });
  
    });

    describe('Users list', () => {
        it('It should get a users list', (done) => {
            chai.request(server)
                .get('/api/users/?email='+userInfo.email)
                .set('Authorization', 'Bearer '+BEARER_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(1);

                done();
                });
        });
  
    });


    describe('User delete', () => {
        
        it('It should update an existing user', (done) => {
            chai.request(server)
                .del('/api/user/'+USER_ID)
                .set('Authorization', 'Bearer '+BEARER_TOKEN)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('deleted');
                done();
                });
        });
  
    });
    
    
})
