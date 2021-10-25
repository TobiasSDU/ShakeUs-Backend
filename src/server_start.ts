import { app } from './index';
import http from 'http';
import { Server } from 'socket.io';
import { generatePartyId } from './util/party_id_generator';

const server = http.createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected on socket: ' + socket.id);
});

server.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log(generatePartyId());
});
