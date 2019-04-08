import express from 'express';
import userModel from '../models/users';
import sendMail from '../helperFunctions/sendEmail';
import validateToken from '../middleware/ValidateToken';
import {validateLogin, validateSignUp} from '../middleware/validateUser'

const router = express.Router();

router.post('/auth/signup', validateSignUp, async(req, res) => {
  const user = await userModel.createUser(req.body);
  if(!user){return res.status(400).send('Invalid Input')}
  try{
    const token = await userModel.generateToken(user.email)
    const subject = "Welcome to BANKA";
    const message = `Welcome to Banka, Your NO.1 BANK!!!`
    const mail = await sendMail(user.email, subject, message);
    res.json({
      "status": 201,
      "data": {
        token,
        "id": user.id,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email
      }
    })
  }catch(err){
    console.error(err)
  }
  
});

router.post('/auth/login', validateLogin, async (req, res) => {
  const user = await userModel.login(req.body.email, req.body.password);
  if(!user){ return res.status(400).json({
    "status": 400,
    "error": "Invalid email or password"
    })
  }else{
    const token = await userModel.generateToken(user.email);
    res.status(200).json({
      "status": 200,
      "data": {
        token,
        "id": user.id,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email
      }
    })
  }
});

router.post('/auth/reset', async (req, res) => {
    const user = await userModel.resetPassword(req.body.email);
    if(!user){ return res.status(400).json({
      "status": 400,
      "error": "Invalid email"
      })
    }else{
      const subject = "PASSWORD RESET SUCCESSFUL"
      const message = `YOUR NEW PASSWORD IS ${user.randomPassword}.`
      try{
        await sendMail(req.body.email, subject, message);
        res.status(200).json({
          "status": 200,
          "message": "New Password Sent to your email address"
        })
      }catch(err){
        console.error(err);
        res.status(500).status.json({
          "status": 500, 
          "error": "Internal Server Error"
        
        })
      }
    }
});

router.get('/', (req, res) => {
  const users = userModel.getAllUsers();
  res.status(200).json({
    "status": 200,
    "data": users
  });
});

router.get('/auth/me', validateToken, (req, res) => {
  const user = userModel.getAUser(req.user.email);
  if (!user) { return res.status(400).send('Invalid Request')}
  res.status(200).json({
    "status": 200,
    "data": user
  })
  });


router.patch('/auth/me', validateToken, (req, res) => {
  const user = userModel.updateUser(req.params.email, req.body.password);
  res.status(200).json({
    "status": 200,
    "message": "Password Changed Successfully"
  });
});

router.delete('/auth/:id', validateToken, (req, res) => {
  if(req.user.isAdmin){
    
    const user = userModel.deleteUser(req.params.id);
    if(user){
      return res.status(200).json({
        "status": 200,
        "message": "User deleted successfully",
      })
    }else{
      return res.status(400).json({
        "status": 400,
        "error": "Invalid User ID"
      })
    }
  
  }else{
    return res.status(403).json({
      "status": 403,
      "error": "Forbidden to see this page"
    })
  }
  
});

export default router;
