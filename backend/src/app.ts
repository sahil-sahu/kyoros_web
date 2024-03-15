// src/app.ts
import express, { Express, Request, Response } from 'express';
const cors = require('cors');

import { createServer } from "http";

import * as dotenv from 'dotenv';
import authRouter from './routes/auth';
dotenv.config();

// Initialize MongoDB client
import mongoose from 'mongoose';
import { redisClient } from './redis';
import patientRouter from './routes/patient';
import { Server } from "socket.io";
import { mainSocket } from './socket/main';

mongoose.connect(process.env.MONGODB_URI);

export const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connection established');
});


const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.use('/api/auth', authRouter);
app.use('/patient', patientRouter);

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

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});