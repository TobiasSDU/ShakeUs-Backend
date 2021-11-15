"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const mongodb_1 = require("mongodb");
const database_connection_1 = require("../config/database_connection");
const server = http_1.default.createServer(index_1.app);
const port = process.env.PORT || 3000;
index_1.app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../api-docs/index.html'));
});
mongodb_1.MongoClient.connect((0, database_connection_1.getDbConnectionString)(), (err, client) => __awaiter(void 0, void 0, void 0, function* () {
    if (err || !client) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    }
    else {
        server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
            const db = client.db('shake-us');
            index_1.app.set('database', db);
            index_1.app.set('socketService', new socket_service_1.SocketService(server));
            compileClient();
            console.log(`listening on port ${port}`);
        }));
    }
}));
const compileClient = () => {
    fs_1.default.writeFile(path_1.default.join(__dirname, '../api-docs/index.html'), nunjucks_1.default.render(path_1.default.join(__dirname, '../api-docs/index.njk')), (err) => {
        if (err)
            console.log(err);
    });
};
