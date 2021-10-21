import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app = express();
const server = createServer(app);
const router = express.Router();
const io = new Server(server);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    const test = { test: 'test' };
    console.log(test);
    res.json(test);
});

io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log(`listening on port ${port}`);
});
