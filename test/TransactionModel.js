import chai from 'chai';
import transactionModel from '../models/transaction';
import uuid from 'uuid';
import moment from 'moment';

const assert = chai.assert;

describe("Transaction Model", () => {

    describe("createTransaction() will create new transaction", () => {
        it("returns an object", () =>{
            const transaction = transactionModel.createTransaction("300000");
            assert.isObject(transaction, "Transaction should be an object");

        });

        it("The transaction Object should contain keys id, createdOn, amount", () =>{
            const transaction = transactionModel.createTransaction("300000");
            assert.hasAllKeys(transaction, ["amount", "createdOn", "id", "status"], "Transaction should have keys id, amount and createdOn");
        });

        it("It should save the transaction Object in the database", () => {
            const transaction = transactionModel.createTransaction("300000");
            assert.include(transactionModel.transactionsDb, transaction, "Transaction object should be saved in the database")
        });
    });

    describe("getATransaction() should get a the transaction with the given id", () => {
        it("Should return null for ", () => {
            const transaction = transactionModel.getATransaction();
            assert.isNull(transaction, "Transaction should be null");
        });

        it("Should return null for an invalid transaction id", () => {
            const transaction = transactionModel.getATransaction();
            assert.isNull(transaction, "Transaction should be null for an invalid id")
        });

        it("Should return an object for a validtransaction id", () => {
            const newTransaction = transactionModel.createTransaction("30000");
            const transaction = transactionModel.getATransaction(newTransaction.id);

            assert.isObject(transaction, "transaction should be an object");
            assert.hasAnyKeys(transaction, ["id", "amount", "createdDate", "status"], "Object should have all the specified keys")
        });
            
        
    });

    describe("GetAllTransactions() should return an array of all transactions in the database", () => {
        it("Should return an array", () => {
            transactionModel.createTransaction('20000.89')
        const transactions = transactionModel.getAllTransactions();

        assert.isArray(transactions, "transactions should be an array");
        });

    });

    describe("deleteTranaction(id) should delete the transaction with the given id from the database", () => {
        Array(4).fill().forEach(item => transactionModel.createTransaction(20000))

        it("It should delete the transaction with the specified id from the database", () => {
           const transaction =  transactionModel.createTransaction('20000.89');
            transactionModel.deleteTransaction(transaction.id);
            const deletedTransaction = transactionModel.getATransaction(transaction.id);

            assert.isNull(deletedTransaction, "It should be null")
        
        })
    })
})