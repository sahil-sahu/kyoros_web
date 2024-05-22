// src/app.ts
import express, { Express, Request, Response } from 'express';
const cors = require('cors');

import { createServer } from "http";

import * as dotenv from 'dotenv';
dotenv.config();

// Initialize MongoDB client
import { redisClient } from '../redis';
import { Server } from "socket.io";
import { mainSocket } from '../socket/main';
import router from './route';
import registerRouter from './register';


const app: Express = express();
const port = process.env.LOGPORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use('/logs', router);
app.use("/register", registerRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Application is healthy' });
});

app.get('/set', async (req, res) => {
  const key = 'myKey';
  const value = 'myValue';

  await redisClient.set(key, value);

  res.send(`Set ${key} to ${value} in Redis`);
});
const corsOptions = {
  origin: '*', // Replace with the client domain or use '*' for all domains
  methods: ['GET', 'POST'], // Specify the allowed HTTP methods
  allowedHeaders: ['Content-Type'], // Specify the allowed headers
  credentials: true // Allow sending credentials (cookies, authorization headers, etc.)
};
// Start the server
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: corsOptions
});
io.on('connection', mainSocket);

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});