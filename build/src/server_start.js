"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const fs_1 = __importDefault(require("fs"));
const socket_service_1 = require("./services/socket_service");
const server = http_1.default.createServer(index_1.app);
const port = process.env.PORT || 3000;
index_1.app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../api-docs/index.html'));
});
server.listen(port, () => {
    index_1.app.set('socketService', new socket_service_1.SocketService(server));
    compileClient();
    console.log(`listening on port ${port}`);
});
const compileClient = () => {
    fs_1.default.writeFile(path_1.default.join(__dirname, '../api-docs/index.html'), nunjucks_1.default.render(path_1.default.join(__dirname, '../api-docs/index.njk')), (err) => {
        if (err)
            console.log(err);
    });
};
