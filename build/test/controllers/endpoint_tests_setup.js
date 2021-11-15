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
exports.closeTestDb = exports.connectToTestDb = exports.getCollection = exports.dropDatabase = exports.req = void 0;
const index_1 = require("../../src/index");
const supertest_1 = __importDefault(require("supertest"));
const database_connection_1 = require("../../config/database_connection");
const socket_service_1 = require("../../src/services/socket_service");
const http_1 = __importDefault(require("http"));
exports.req = (0, supertest_1.default)(index_1.app);
const dropDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, database_connection_1.getDatabase)();
    return yield db.dropDatabase();
});
exports.dropDatabase = dropDatabase;
const getCollection = (collectionName) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, database_connection_1.getDatabase)();
    return db.collection(collectionName);
});
exports.getCollection = getCollection;
const connectToTestDb = (dbClient, dbName) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield dbClient.connect()) {
        const db = yield dbClient.db(dbName);
        index_1.app.set('database', db);
        const server = yield http_1.default.createServer(index_1.app);
        index_1.app.set('socketService', new socket_service_1.SocketService(server));
        index_1.app.set('server', server);
    }
    else {
        console.log('Error connection to MongoDB');
    }
    return null;
});
exports.connectToTestDb = connectToTestDb;
const closeTestDb = (dbClient) => __awaiter(void 0, void 0, void 0, function* () {
    yield dbClient.close();
    return null;
});
exports.closeTestDb = closeTestDb;
