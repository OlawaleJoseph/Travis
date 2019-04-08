import express from 'express';
import accountModel from '../models/account';
import userModel from '../models/users'
import { noMultipleAccounts, staffOnly, viewMyAccount, updateStatus } from '../middleware/ValidateAccount';


const router = express.Router();


router.get('/', staffOnly, (req, res) => {
  const accounts = accountModel.getAllAccounts();
  return res.status(200).json({
    "status": 200,
    "data": accounts
  });
});

router.post('/', noMultipleAccounts, async(req, res) => {
  const account = accountModel.createAccount(req.body, req.user.id)
  if(!account){return res.status(400).send('Invalid Input')};
  const user = userModel.getAUser(req.user.email)
  res.status(201).json({
      "status": 201,
      "data": {
        "accountNumber": account.accountNumber,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "type": account.type,
        "openingBalance": account.balance
      }
  })
});

router.get('/:accountNumber', viewMyAccount, (req, res) => {
  const account = accountModel.getAccount(req.params.accountNumber);
  if (!account) { return res.status(400).send('Invalid Request')}
  if(account.owner == req.user.id || req.user.type == "staff"){
    return res.status(200).json({
      "status": 200,
      "data": {
        "id": account.id,
        "accountNumber": account.accountNumber,
        "balance": account.balance,
        "type": account.type,
        "owner": account.owner
      }
    })
  }else{
    return res.status(403).json({
      "status": 403,
      "error": "Forbidden to view this page"
    })
  }
  
  });


router.patch('/:accountNumber', updateStatus, (req, res) => {
  if(req.user.isAdmin){
    const account = accountModel.updateAccount(req.params.accountNumber, req.body.status);
    res.status(200).json({
      status: 200,
      data: {
        "accountNumber": account.accountNumber,
        "status": account.status,
        "modifiedDate": account.modifiedDate,
        "balance": account.balance,
        "type": account.type
      }
    })
  }else{
    return res.status(403).json({
      "status": 403,
      "error": "Forbidden to view this page"
    })
  }
  
});

router.delete('/:accountNumber', (req, res) => {
  const account = accountModel.getAccount(req.params.accountNumber);
  if(!account){ return res.status(203).json({
    "status": 400,
    "message": "Invalid Account"
  })}
  if(req.user.isAdmin){
    const deletedAccount = accountModel.deleteAccount(account.accountNumber);
    if(deletedAccount){
      return  res.status(200).json({
        "status": 200,
        "message": "Account successfully deleted"
      });
    }
    
  }else{
    return res.status(403).json({
      "status": 403,
      "error": "Forbidden to view this page"
    })
  }
 
});

export default router;
