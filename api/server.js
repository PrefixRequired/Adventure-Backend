const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config()

const server = express();

const roomsRouter = require('./routes/rooms')

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/rooms", roomsRouter)

server.get('/', (req, res) => {
    res.status(200).send('<h2>5x5</h2>');
});

module.exports = server;