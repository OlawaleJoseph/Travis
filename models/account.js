import moment from 'moment';

class Account {
    constructor() {
      this.accountsDb = [];
    }
  
  
    createAccount(data, owner) {
      let status;
      const {
         type, amount,
      } = data;
      if(!/\d/.test(amount) || /[^a-z]/gi.test(type)){
        return null
      }
      const accountNumber = this.generateAccountNumber();
      if(parseFloat(amount) == 0){
         status = "draft"
        }else{
          status = "active"
        }
      const newAccount = {
        id: this.accountsDb.length + 1,
        accountNumber,
        type,
        balance: parseFloat(amount),
        createdDate: moment(),
        owner,
        status
      };
      
      this.accountsDb.push(newAccount);
      return newAccount;
    }  
  
    getAccount(number) {
      if(!number){ return null }
      const account =  this.accountsDb.find(account => account.accountNumber == number);
      if(!account){ return null}
      return account;
    }
  
    getAllAccounts() {
      return this.accountsDb;
    }
  
    updateAccount(number, status) {
      if(!number){ return null}
      const account = this.getAccount(number);
      if(!account) { return null }
      const index = this.accountsDb.indexOf(account);
      account.status = status;
      account.modifiedDate = moment()
      return this.accountsDb[index];
    }
  
    deleteAccount(number) {
      if(!number){ return null }
      const account = this.getAccount(number);
      if(!account){ return }
      const index = this.accountsDb.indexOf(account);
      return this.accountsDb.splice(index, 1);
    }

    generateAccountNumber(){
      let accountNumber = '1';
        while(accountNumber.length != 10){
          accountNumber += Math.floor(Math.random() * 9)
        }
        
        return parseInt(accountNumber);
    };

}
  
  export default new Account()


  