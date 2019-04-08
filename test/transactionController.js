import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import accountModel from '../models/account';
import userModel from '../models/users';
import transactionModel from '../models/transaction';

const assert = chai.assert;

chai.use(chaiHttp);


describe("TRANSACTION CONTROLLER", () => {
    let cashierToken, customerToken, adminToken
    let cashier, customer, admin;
    let newTransaction, account;
    beforeEach( async () =>{
        const client = {
            firstName: "John",
            lastName: "Doe",
            email: "mike@gmail.com",
            type: "client",
            password: "password",
            isAdmin: false,
        }
        const staff = {
            firstName: "Jane",
            lastName: "Doe",
            email: "jane@gmail.com",
            type: "staff",
            password: "password",
            isAdmin: false,
        }
        const adminStaff = {
            firstName: "Janet",
            lastName: "Doe",
            email: "janet@gmail.com",
            type: "staff",
            password: "password",
            isAdmin: true,
        }
        customer = await userModel.createUser(client);
        cashier = await userModel.createUser(staff)
        admin = await userModel.createUser(adminStaff)
        cashierToken = await userModel.generateToken(cashier.email);
        customerToken = await userModel.generateToken(customer.email);
        adminToken = await userModel.generateToken(admin.email);

        account = accountModel.createAccount({
            amount: 500000,
            type: "current"
        }, customer.id);
        newTransaction = transactionModel.createTransaction(300000)
    })

    after(  () => {
        userModel.usersDb = []
        accountModel.accountsDb = []
        transactionModel.transactionsDb = [];
        
    });
    describe("POST/ should create transaction", () => {
        it("Should create a Debit transaction and return a status of 201", () => {
            chai.request(server)
            .post(`/api/v1/transactions/${account.accountNumber}/debit`)
            .set("x-access-token", cashierToken)
            .send({amount: 73482.35})
            .end((err, res) => {
                
                
                
                assert.isObject(res.body, "res.body should be an object");
                assert.hasAllKeys(res.body.data, ["transactionId", "type", "accountNumber", "cashier", "amount", "balance"]);
                assert.equal(res.body.status, 201, "Status should be 201")
            })
        });

        it("Should create a Credit transaction and return a status of 201", () => {
            chai.request(server)
            .post(`/api/v1/transactions/${account.accountNumber}/credit`)
            .set("x-access-token", cashierToken)
            .send({amount: 73482.35})
            .end((err, res) => {
                
            
                assert.isObject(res.body, "res.body should be an object");
                assert.hasAllKeys(res.body.data, ["transactionId", "type", "accountNumber", "cashier", "amount", "balance"]);
                assert.equal(res.body.status, 201, "Status should be 201")
            })
        });
    });


    describe("GET/:id Should return a transaction with the given id", () => [
        it("Should return status of 200 with the transaction object", () => {
            chai.request(server)
            .get(`/api/v1/transactions/${newTransaction.id}`)
            .set("x-access-token", adminToken)
            .end((err, res) => {
                
                assert.isObject(res.body)
                assert.equal(res.body.status, 200);
            })
        })
    ]);


    describe("DELETE/:id Should delete a transaction with the given id", () => [
        it("Should return status of 200 ", () => {
            chai.request(server)
            .delete(`/api/v1/transactions/${newTransaction.id}`)
            .set("x-access-token", adminToken)
            .end((err, res) => {
               
                assert.isObject(res.body)
                assert.equal(res.body.status, 200);
            })
        })
    ]);
})