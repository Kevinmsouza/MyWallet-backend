import express from 'express';
import cors from 'cors';
import { postSignIn, postSignUp } from './controllers/users.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/check-status', (req, res) => res.send('Online'))

// USERS
app.post('/sign-up', postSignUp)
app.post('/sign-in', postSignIn)

app.listen(4000)
console.log('Listening to 4000...')