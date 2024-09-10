import dotenv from "dotenv";

dotenv.config()

import path from 'path';
import { app, server } from './socket/socket.js';
import express from 'express';
import cookieParser from "cookie-parser";
const __dirname = path.resolve();

dotenv.config({path: path.join(__dirname,"/.env")})

app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname,"/client/dist")));

app.get("*",(req,res) => {
  res.sendFile(path.join(__dirname,"client","dist","index.html"))
})


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
