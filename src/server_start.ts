import { app } from './index';
import http from 'http';
import path from 'path';
import nunjucks from 'nunjucks';
import fs from 'fs';
import { SocketService } from './services/socket_service';

const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../api-docs/index.html'));
});

server.listen(port, () => {
    app.set('socketService', new SocketService(server));
    compileClient();
    console.log(`listening on port ${port}`);
});

const compileClient = () => {
    fs.writeFile(
        path.join(__dirname, '../api-docs/index.html'),
        nunjucks.render(path.join(__dirname, '../api-docs/index.njk')),
        (err) => {
            if (err) console.log(err);
        }
    );
};
