import dotenv from "dotenv";

dotenv.config()

import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import cors from 'cors';
import handleSocketEvents  from '../handler/socketHandler.js';

// Rest of your code...


app.use(cors({
	origin: process.env.APP_URL, // Your frontend URL
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type'],
	credentials: true // Allow cookies and authentication headers
  }));

  
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
	transports: ['polling'],
	cors: {
		origin: process.env.APP_URL,
		methods: ["GET", "POST"],
	},
});

handleSocketEvents(io);

export { server, app, io };