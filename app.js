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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is istening on Port ${port}`);
});

export default app;