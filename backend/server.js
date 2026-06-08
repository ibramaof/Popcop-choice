import './config/env.js';
import express from 'express';
import cors from 'cors';
import recommendRoute from './routes/recommend.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', recommendRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`app running on port ${PORT} `));