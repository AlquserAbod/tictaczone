import dotenv from "dotenv";

dotenv.config()

import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import cors from 'cors';
import handleSocketEvents  from '../handler/socketHandler.js';

// Rest of your code...




const app = express();

app.use(cors({
	origin: process.env.APP_URL, // Your frontend URL
	methods: ['GET', 'POST'],
	credentials: true // Allow cookies and authentication headers
  }));

  const server = http.createServer(app);

const io = new Server(server, {
	transports: ['websocket', 'polling'],
	cors: {
		origin: process.env.APP_URL,
		methods: ["GET", "POST"],
	},
});

handleSocketEvents(io);

export { server, app, io };