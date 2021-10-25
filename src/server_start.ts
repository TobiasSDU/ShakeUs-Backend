import { app } from './index';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import nunjucks from 'nunjucks';
import fs from 'fs';

const server = http.createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dummy-client/index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected on socket: ' + socket.id);
});

server.listen(port, () => {
    compileClient();
    console.log(`listening on port ${port}`);
});

const compileClient = () => {
    fs.writeFile(
        path.join(__dirname, '../dummy-client/index.html'),
        nunjucks.render(path.join(__dirname, '../dummy-client/index.njk')),
        (err) => {
            if (err) console.log(err);
        }
    );
};
