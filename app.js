import express from 'express';
import userRouter from './Controllers/users';
import accountRouter from './Controllers/account';
import transactionRouter from './Controllers/transaction';
import validateToken from './middleware/ValidateToken';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/accounts', validateToken, accountRouter);
app.use('/api/v1/transactions', validateToken, transactionRouter);


// app.listen(3000, () => {
//   console.log('App is istening on Port 3000');
// });

export default app;