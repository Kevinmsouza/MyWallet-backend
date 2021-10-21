import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/check-status', (req, res) => res.send('Online'))

app.listen(4000)
console.log('Listening to 4000...')