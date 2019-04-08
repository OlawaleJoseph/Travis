import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import userModel from '../models/users'

const assert = chai.assert;

chai.use(chaiHttp);


describe("User Controllers", () => {
    let user;
    let token;
    beforeEach(async () => {
        userModel.usersDb = []
        const client = {
            firstName: "John",
            lastName: "Doe",
            email: "mike@gmail.com",
            type: "staff",
            password: "password",
            isAdmin: true
        }
        user = await userModel.createUser(client);
        token = await userModel.generateToken(user.email)
    });

    afterEach(  () => {
        user = "";
        token = ""
    })
    
    describe("POST/auth/signup", function () {
        this.timeout(10000);
        it("Should create new user", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/signup')
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "bankaadc@gmail.com",
                type: "client",
                password: "password"
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 201, "Response status should be 201");
                assert.hasAllKeys(res.body, ["status", "data"],"Response body should have status and data keys")
                assert.isObject(res.body.data, "Data should be an object");
                assert.hasAllKeys(res.body.data, ["token", "id", "firstName", "lastName", "email"]);

                done()
            })
        });

        it("Should return status of 400", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/signup')
            .send({
                firstName: "",
                lastName: "Doe",
                email: "bankaadc@gmail.com",
                type: "client",
                password: "password"
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 400, "Response status should be 400");
                

                done()
            })
        });

        it("Should return status of 400", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/signup')
            .send({
                firstName: "John",
                lastName: "",
                email: "bankaadc@gmail.com",
                type: "client",
                password: "password"
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 400, "Response status should be 400");
                

                done()
            })
        });

        it("Should return status of 400", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/signup')
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "bankaad",
                type: "client",
                password: "password"
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 400, "Response status should be 400");
                

                done()
            })
        });

        it("Should return status of 400", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/signup')
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "bankaadc@gmail.com",
                type: "aaa",
                password: "password"
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 400, "Response status should be 400");
                

                done()
            })
        });

        it("Should return status of 400", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/signup')
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "bankaadc@gmail.com",
                type: "client",
                password: ""
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 400, "Response status should be 400");
                

                done()
            })
        });
    });


    describe("POST/auth/login", () => {
        it("Should login user", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/login')
            .send({
                "email": "mike@gmail.com",
                "password": "password"
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 200, "Response status should be 200");
                assert.hasAllKeys(res.body, ["status", "data"],"Response body should have status and data keys")
                assert.isObject(res.body.data, "Data should be an object");
                assert.hasAllKeys(res.body.data, ["token", "id", "firstName", "lastName", "email"]);

                done()
            })
        });

        it("Should login user", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/login')
            .send({
                "email": "",
                "password": "password"
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 400, "Response status should be 400");
                done()
            })
        });

        it("Should login user", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/login')
            .send({
                "email": "dsaaas",
                "password": "password"
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 400, "Response status should be 400");
                done()
            })
        });


        it("Should login user", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/login')
            .send({
                "email": "mike@gmail.com",
                "password": ""
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 400, "Response status should be 400");
                done()
            })
        });

    });


    describe("POST/auth/reset", function (){
        this.timeout(10000);
        it("Should reset user  password", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/reset')
            .send({
                "email": "mike@gmail.com",
            })
            .end((err, res) => {
                
                assert.equal(res.body.status, 200, "Response status should be 200");
                assert.hasAllKeys(res.body, ["status", "message"],"Response body should have status and data keys")
                assert.isString(res.body.message, "Data should be a string");
               
                done()
            })
        });

        it("Should have a 400 status", (done) => {
            chai.request(server)
            .post('/api/v1/users/auth/reset')
            .send({"email": "abcde@gmail.com"})
            .end((err, res) => {
                
                
                assert.equal(res.body.status, 400, "Response status should be 400");
                assert.hasAllKeys(res.body, ["status", "error"],"Response body should have status and error")
                assert.isString(res.body.error, "Error should be string");

                done()
            })
        });
    });

    describe("GET/ Should get all users", () =>{
        it("Should return an array of users", () => {
            chai.request(server)
            .get('/api/v1/users')
            .end((err, res) => {
              
                assert.equal(res.body.status, 200, "Status should be 200");
                assert.isArray(res.body.data, "Data should be an array")
                
            })
        });
    });

    describe("GET/me Should get a specific user", () => {
        it("Should return a specific user", () => {
            chai.request(server)
            .get('/api/v1/users/auth/me')
            .set("x-access-token", token)
            .end((err, res) => {
                
                assert.isObject(res.body, "Response body should be an object");
                assert.equal(res.body.status, 200, "Status should be 200");
                assert.hasAnyDeepKeys(res.body.data, ["id", "firstName", "lastName","email"]);
            })
        });

        it("Should return an error message for invalid token", () => {
            chai.request(server)
            .get('/api/v1/users/auth/me')
            .set("x-access-token", "abc")
            .end((err, res) => {
              
                assert.isObject(res.body, "Response body should be an object");
                assert.equal(res.body.status, 400, "Status should be 400");
                assert.isString(res.body.error, "Error message should be string");
            })
        })
        
    });


    describe("PATCH/me Should get a specific user", () => {
        it("Should update user's password", () => {
            chai.request(server)
            .patch('/api/v1/users/auth/me')
            .set("x-access-token", token)
            .end((err, res) => {
                assert.isObject(res.body, "Response body should be an object");
                assert.equal(res.body.status, 200, "Status should be 200");
                assert.isString(res.body.message, "message should be string")
            })
        });

        it("Should return an error message for invalid token", () => {
            chai.request(server)
            .patch('/api/v1/users/auth/me')
            .set("x-access-token", "abc")
            .end((err, res) => {
             
                assert.isObject(res.body, "Response body should be an object");
                assert.equal(res.body.status, 400, "Status should be 400");
                assert.isString(res.body.error, "Error message should be string");
            })
        })
        
    });


    describe("DELETE/:ID to delete a user", () => {
        
        it("Should have status of 200", () => {
            chai.request(server)
            .delete('/api/v1/users/auth/' + user.id)
            .set("x-access-token", token)
            .end((err, res) => {

                assert.isNotEmpty(res.body, "res.body shouldn't be empty");
                assert.equal(res.body.status, 200, "Status should be 200");
                assert.isString(res.body.message, "message property should be string");
            });
        });

        it("Should have status of 400 for invalid id", () => {
            chai.request(server)
            .delete('/api/v1/users/auth/' + 0)
            .set("x-access-token", token)
            .end((err, res) => {

                assert.isNotEmpty(res.body, "res.body shouldn't be empty");
                assert.equal(res.body.status, 400, "Status should be 400");
                assert.isString(res.body.error, "message property should be string");
            });
        });

        
    });


})