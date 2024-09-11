import dotenv from "dotenv";

dotenv.config()

import { app, server } from './socket/socket.js';
import express from 'express';
import cookieParser from "cookie-parser";
import path from 'path';

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});




const __dirname = path.resolve();

app.use(express.static(path.join(__dirname,"/client/dist")))
app.get("*", (req,res) => {
  res.sendFile(path.resolve(__dirname,'client','dist','index.html'))
})
app.get('/', (req, res) => {
  res.send('Socket.io server running.');
});