import express from 'express';
import cors from 'cors';

import config from './config.js';
import morgan from 'morgan';

import userRoutes from './Routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// routes
app.use('/users', userRoutes);

app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);