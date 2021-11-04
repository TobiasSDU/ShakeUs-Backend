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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = exports.getDbConnectionString = exports.setCurrentDbMode = exports.getCurrentDbMode = void 0;
const mongodb_1 = require("mongodb");
let currentDbMode;
const getCurrentDbMode = () => {
    if (!currentDbMode) {
        currentDbMode = 'prod';
    }
    return currentDbMode;
};
exports.getCurrentDbMode = getCurrentDbMode;
const setCurrentDbMode = (dbMode) => {
    currentDbMode = dbMode;
};
exports.setCurrentDbMode = setCurrentDbMode;
const getDbConnectionString = () => {
    let connectionString;
    switch ((0, exports.getCurrentDbMode)()) {
        case 'prod':
            connectionString = process.env.SHAKE_US_MONGO_URI;
            break;
        case 'testFile1':
            connectionString = process.env.SHAKE_US_MONGO_TEST1_URI;
            break;
        case 'testFile2':
            connectionString = process.env.SHAKE_US_MONGO_TEST2_URI;
            break;
        case 'testFile3':
            connectionString = process.env.SHAKE_US_MONGO_TEST3_URI;
            break;
        case 'testFile4':
            connectionString = process.env.SHAKE_US_MONGO_TEST4_URI;
            break;
    }
    return connectionString;
};
exports.getDbConnectionString = getDbConnectionString;
const getDatabase = (connectionString) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(connectionString);
    yield client.connect();
    return client.db();
});
exports.getDatabase = getDatabase;
