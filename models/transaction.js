import moment from 'moment';


class Transaction {
  constructor() {
    this.transactionsDb = [];
  }


  createTransaction(amount) {
     
    const newTransaction = {
      id: this.transactionsDb.length + 1,
      amount: parseFloat(amount),
      createdOn: moment(),
      status: "active"
    }
    
    this.transactionsDb.push(newTransaction);
    return newTransaction;
    
  }

  getATransaction(id) {
    if(!id){ return null }
    const transaction = this.transactionsDb.find(transaction => transaction.id == id);
    if(!transaction) { return null}
    else {return transaction}
  }

  getAllTransactions() {
    return this.transactionsDb;
  }

  deleteTransaction(id) {
    const transaction = this.getATransaction(id);
    const index = this.transactionsDb.indexOf(transaction);
    return this.transactionsDb.splice(index, 1);
  }
}

export default new Transaction();
