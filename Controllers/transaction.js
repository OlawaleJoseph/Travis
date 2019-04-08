import express from 'express';
import transactionModel from '../models/transaction';
import accountModel from '../models/account';
import validateCashier from '../middleware/validateCashier';
import userModel from '../models/users';
import sendMail from '../helperFunctions/sendEmail'
import dotenv from 'dotenv';

dotenv.config();


const router = express.Router();


router.get('/', (req, res) => {
  if(req.user.type.toLowerCase() == "staff"){
    const transactions = transactionModel.getAllTransactions();
   return res.status(200).json({
      "status":200,
      "data": transactions
  });
  }else{
    return res.status(403).json({
      "status": 403,
      "error": "Forbidden to view this page"
    })
  }
  
});

router.post('/:accountNumber/debit', validateCashier, async(req, res) => {
  const transaction = transactionModel.createTransaction(req.body.amount);
  if(!transaction){return res.status(400).send('Invalid Input')};
    transaction.accountNumber = req.params.accountNumber;
    transaction.type = "Debit";
    const account = accountModel.getAccount(transaction.accountNumber);
    transaction.oldBalance = parseFloat(account.balance);
    transaction.newBalance = transaction.oldBalance - parseFloat(transaction.amount);
    account.balance = transaction.newBalance;
    const accountOwner = userModel.usersDb.find(user => user.id == account.owner);
    const accountEmail = accountOwner.email;
    const message = `
    Account Number: ${transaction.accountNumber}
    Debit
    Amount: ${transaction.amount}
    Balance: ${account.balance}
    `;
    const mail = await sendMail(accountEmail, "TRANSACTION NOTIFICATION", message)
    if(mail){ console.log(mail) }
    return res.status(201).json({
      "status": 201,
      "data": {
        "transactionId": transaction.id,
        "type": transaction.type,
        "accountNumber": Number(transaction.accountNumber),
        "cashier": req.user.id,
        "type": "Debit",
        "amount": req.body.amount,
        "balance": transaction.newBalance,
      }
    })
});


router.post('/:accountNumber/credit', validateCashier, async(req, res) => {
  const transaction = transactionModel.createTransaction(req.body.amount);
  if(!transaction){return res.status(400).send('Invalid Input')};
    transaction.accountNumber = req.params.accountNumber;
    transaction.type = "Credit";
    const account = accountModel.getAccount(transaction.accountNumber);
    transaction.oldBalance = parseFloat(account.balance);
    transaction.newBalance = transaction.oldBalance + parseFloat(transaction.amount);
    account.balance = transaction.newBalance;
    const accountOwner = userModel.usersDb.find(user => user.id == account.id);
    const accountEmail = accountOwner.email;
    const message = `
    Account Number: ${transaction.accountNumber}
    Credit
    Amount: ${transaction.amount}
    Balance: ${account.balance}
    `;
    const mail = await sendMail(accountEmail, "TRANSACTION NOTIFICATION", message)
    if(mail){ console.log(mail)}
    return res.status(201).json({
      "status": 201,
      "data": {
        "transactionId": transaction.id,
        "type": transaction.type,
        "accountNumber": transaction.accountNumber,
        "cashier": req.user.id,
        "amount": req.body.amount,
        "balance": transaction.newBalance,
      }
    })
});

  
  router.get('/:id', (req, res) => {
  const transaction = transactionModel.getATransaction(req.params.id);
  if (!transaction) { return res.status(400).json({
    "status": 400,
    "error": "Invalid  Request"
  })
}
  if(req.user.type == "staff"){
    return res.json({
      "status": 200,
      "data": {
        "id": transaction.id,
        "amount": transaction.amount,
        "type": transaction.type,
        "accountNumber": transaction.accountNumber,
        "newBalance": transaction.newBalance,
        "date": transaction.createdOn
      }
    })
  }else{
    const account = accountModel.getAccount(transaction.accountNumber);
    if(req.user.id == account.owner){
      res.json({
        "status": 200,
        "data": transaction
      })
    }else{
      res.status(403).json({
        "status": 403,
        "error": "Forbidden to view this page"
      })
    }
  }
  
  });

router.delete('/:id', (req, res) => {
  
  if(req.user.isAdmin){
    transactionModel.deleteTransaction(req.params.id);
    return  res.status(200).json({
      "status": 200,
      "message": "Transaction successfully deleted",
    });
  }
 return res.status(403).json({
   "status": 403,
   "error": "Not allowed"
 })
});

export default router;
