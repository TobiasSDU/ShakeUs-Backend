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
const database_connection_1 = require("../../config/database_connection");
const src_1 = require("../../src");
const socket_service_1 = require("../../src/services/socket_service");
const guest_test_helpers_1 = require("../helpers/guest_test_helpers");
const guest_seed_1 = require("../seed/guest.seed");
const endpoint_tests_setup_1 = require("./endpoint_tests_setup");
const http_1 = __importDefault(require("http"));
let server;
beforeAll(() => {
    server = http_1.default.createServer(src_1.app);
    (0, database_connection_1.setCurrentDbMode)('testFile2');
    src_1.app.set('socketService', new socket_service_1.SocketService(server));
});
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, guest_seed_1.seedGuestsCollection)();
}));
describe('endpoint tests for Guest routes using GET', () => {
    test('GET request to /guest returns a guest', () => __awaiter(void 0, void 0, void 0, function* () {
        const guestId = guest_seed_1.testGuest1.id;
        const res = yield endpoint_tests_setup_1.req.get('/guest').send({
            guestId: guestId,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body._id).toEqual(guestId);
        expect(res.body.name).toBeTruthy();
    }));
    test('GET request to /guest with an invalid guestId returns 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const guestId = 'invalidId';
        const res = yield endpoint_tests_setup_1.req.get('/guest').send({
            guestId: guestId,
        });
        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    }));
});
describe('endpoint tests for Guest routes using PATCH', () => {
    test('PATCH request to /guest updates name field', () => __awaiter(void 0, void 0, void 0, function* () {
        const guestId = guest_seed_1.testGuest1.id;
        const newName = 'NewGuestName';
        const res = yield endpoint_tests_setup_1.req.patch('/guest').send({
            guestId: guestId,
            newName: newName,
        });
        expect(res.statusCode).toEqual(200);
        const guest = yield (0, guest_test_helpers_1.getTestGuest)(guestId);
        expect(guest.body._id).toEqual(guestId);
        expect(guest.body.name).toEqual(newName);
    }));
    test('PATCH request to /guest with an invalid guestId returns 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const guestId = 'invalidId';
        const newName = 'NewGuestName';
        const res = yield endpoint_tests_setup_1.req.patch('/guest').send({
            guestId: guestId,
            newName: newName,
        });
        expect(res.statusCode).toEqual(400);
    }));
});
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, endpoint_tests_setup_1.dropDatabase)();
}));
afterAll(() => {
    server.close();
});
