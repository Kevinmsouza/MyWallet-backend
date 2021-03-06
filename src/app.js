import express from 'express';
import cors from 'cors';
import { postLogout, postSignIn, postSignUp } from './controllers/users.js';
import {
    deleteOperation, getOperations, postAddOperation, putEditOperation,
} from './controllers/operations.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/check-status', (req, res) => res.send('Online'));

// USERS
app.post('/sign-up', postSignUp);
app.post('/sign-in', postSignIn);
app.post('/logout', postLogout);

// OPERATIONS
app.get('/operations', getOperations);
app.post('/operations', postAddOperation);
app.put('/operations/:id', putEditOperation);
app.delete('/operations/:id', deleteOperation);

export default app;
