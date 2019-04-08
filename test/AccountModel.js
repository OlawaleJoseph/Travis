import chai from 'chai';
import accountModel from '../models/account';

const assert = chai.assert;

describe("Account Model", () => {
    
    describe("createAccount(data) should create new account", () => {
       
        it("Should return an object", () =>{
            const newAccountInfo = {
                "type": "savings",
                "amount": 5000.37,
              };
              const newAccount = accountModel.createAccount(newAccountInfo);
            assert.isObject(newAccount, "newAccount is an object");
        });

        it("New account should have accountNumber", () => {
            const newAccountInfo = {
                "type": "savings",
                "amount": 5000.37,
              };
              const newAccount = accountModel.createAccount(newAccountInfo);

            assert.call(accountModel.createAccount, accountModel.generateAccountNumber, "It should call generateAccountNumber to generate account number for new account");
            assert.hasAnyKeys(newAccount, ["accountNumber"], "new account should have account number")
        });

        it("Should be saved in the database", () => {
            const newAccountInfo = {
                "type": "savings",
                "amount": 5000.37,
              };
              const newAccount = accountModel.createAccount(newAccountInfo);

              const searchedAccount = accountModel.accountsDb.find((account) => account.accountNumber == newAccount.accountNumber);

              assert.isNotNull(searchedAccount, "Account created should be in the database");
              assert.isObject(searchedAccount, "Account should be an Object");
        });
        
    });


    describe("getAccount() should return account with the specified account number", () => {
        
          
          it("should return null if no account number is given", () => {
              const account = accountModel.getAccount();

              assert.isNull(account, "account should be null for empty account number")
          });

          it("should return null if invalid account number is given", () => {
            const account = accountModel.getAccount(0);

            assert.isNull(account, "account should be null for invalid account number")
        });

        it("Should return account object for a valid account number", () =>{
            const newAccountInfo = {
                "type": "current",
                "amount": 5000.37,
            };
            const newAccount = accountModel.createAccount(newAccountInfo);
            const id = newAccount.accountNumber;
            
            const searchedAccount = accountModel.getAccount(id);

            assert.isObject(searchedAccount, "Should be an object");
            assert.hasAnyKeys(searchedAccount, ["accountNumber", "id"], "it should have account number as property");
            assert.equal(searchedAccount.accountNumber, newAccount.accountNumber, "It should return the account with the same account number that is requested")
        });

          

    });

    describe("getAllAccounts() It should get all accounts in database", ()=> {
        it("Should return an Array of account objects", () => {
            const accounts = accountModel.getAllAccounts();

            assert.isArray(accounts, "Accounts should be an array");
        });
    });

    describe("updateAccount() It should update the account's status property", () => {
        it("Return null if no account number is given", () => {
            const emptyId = accountModel.updateAccount("", "dormant");
            const invalidID = accountModel.updateAccount(0, "dormant");
            assert.isNull(emptyId);
            assert.isNull(invalidID);
        });

        it("should update the status of the specified account", () => {
            const Info = {
                "type": "current",
                "amount": 5000.37,
            };
            const account = accountModel.createAccount(Info);
            const oldStatus = account.status;
            const updatedAccount = accountModel.updateAccount(account.accountNumber, "dormant");
            const newStatus = updatedAccount.status;

            assert.notEqual(oldStatus, newStatus, "The status should be different")
        });

        it("returns the updated account object", () => {
            const info = {
                "type": "current",
                "amount": 5000.37,
            };
            const account = accountModel.createAccount(info);
            const updatedAccount = accountModel.updateAccount(account.accountNumber, "dormant");
            assert.isObject(updatedAccount, "updated account should be an object")
        });
    });

    describe("deleteAccount(number) should delete an account with the account number", () => {

        it("should return null for an invalid or no account number", () => {
            const emptyId = accountModel.deleteAccount("", "dormant");
            const invalidID = accountModel.deleteAccount(0, "dormant");

            assert.isNull(emptyId, "No account number should return null");
            assert.isNull(invalidID, "Invalid account number should return null")
        });

        it("It deletes an account with the given account number", () => {
            const info = {
                "type": "current",
                "amount": 5000.37,
            };
            const account = accountModel.createAccount(info);
            accountModel.deleteAccount(account.accountNumber);
            const deletedUser = accountModel.getAccount(account.accountNumber);

            assert.isNull(deletedUser);
        });
    });

    describe("generateAccountNumber() will generate account numbers when invoked", () => {
        it("should return a ten digit Integer", () => {
            const accountNumber  = accountModel.generateAccountNumber();
            assert.isNumber(accountNumber, "Account number should be an Integer");
            assert.lengthOf(accountNumber.toString(), 10, "Account number should be 10 digits long")
        });

        
    })
})