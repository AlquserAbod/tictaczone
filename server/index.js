import dotenv from "dotenv";

dotenv.config()

import { app, server } from './socket/socket.js';
import express from 'express';
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
