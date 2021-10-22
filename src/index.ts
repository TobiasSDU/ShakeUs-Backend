import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

import { partyRoutes } from './routes/party_routes';
import { guestRoutes } from './routes/guest_routes';

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ test: 'test' });
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

app.use('/party', partyRoutes);
app.use('/guest', guestRoutes);
