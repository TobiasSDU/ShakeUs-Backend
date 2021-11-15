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
const database_connection_1 = require("../../config/database_connection");
const src_1 = require("../../src");
const guest_test_helpers_1 = require("../helpers/guest_test_helpers");
const guest_seed_1 = require("../seed/guest.seed");
const endpoint_tests_setup_1 = require("./endpoint_tests_setup");
const party_seed_1 = require("../seed/party.seed");
const party_seed_2 = require("./../seed/party.seed");
const guest_seed_2 = require("./../seed/guest.seed");
const mongodb_1 = require("mongodb");
let dbClient;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, database_connection_1.setCurrentDbMode)('testFile2');
    dbClient = new mongodb_1.MongoClient((0, database_connection_1.getDbConnectionString)());
    yield (0, endpoint_tests_setup_1.connectToTestDb)(dbClient, 'shake-us-test-2');
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, guest_seed_1.seedGuestsCollection)();
    yield (0, party_seed_2.seedPartiesCollection)();
}));
describe('endpoint tests for Guest routes using GET', () => {
    test('GET request to /guest/:guestId returns a guest', () => __awaiter(void 0, void 0, void 0, function* () {
        const guestId = guest_seed_1.testGuest1.id;
        const res = yield endpoint_tests_setup_1.req.get(`/guest/${guestId}`).send();
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body._id).toEqual(guestId);
        expect(res.body.name).toBeTruthy();
        expect(res.body.notificationToken).toEqual(guest_seed_1.testGuest1.getNotificationToken);
    }));
    test('GET request to /guest/:guestId with an invalid guestId returns 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const guestId = 'invalidId';
        const res = yield endpoint_tests_setup_1.req.get(`/guest/${guestId}`).send();
        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    }));
    test('GET request to guest/get-all/:partyId/:userId returns all guests in a party', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty2.id;
        const res = yield endpoint_tests_setup_1.req
            .get(`/guest/get-all/${partyId}/${guest_seed_1.testGuest1.id}`)
            .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body.guests.length).toEqual(2);
        expect(res.body.guests[0]._id).toEqual(guest_seed_1.testGuest1.id);
        expect(res.body.guests[0].name).toEqual(guest_seed_1.testGuest1.getName);
        expect(res.body.guests[1]._id).toEqual(guest_seed_1.testGuest2.id);
        expect(res.body.guests[1].name).toEqual(guest_seed_1.testGuest2.getName);
        expect(res.body.hosts.length).toEqual(1);
        expect(res.body.hosts[0]._id).toEqual(guest_seed_2.testGuest3.id);
        expect(res.body.hosts[0].name).toEqual(guest_seed_2.testGuest3.getName);
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
    test('PATCH request to /guest updates notificationToken', () => __awaiter(void 0, void 0, void 0, function* () {
        const guestId = guest_seed_1.testGuest1.id;
        const newNotificationToken = 'TestToken';
        const res = yield endpoint_tests_setup_1.req.patch('/guest').send({
            guestId: guestId,
            newNotificationToken: newNotificationToken,
        });
        expect(res.statusCode).toEqual(200);
        const guest = yield (0, guest_test_helpers_1.getTestGuest)(guestId);
        expect(guest.body._id).toEqual(guestId);
        expect(guest.body.notificationToken).toEqual(newNotificationToken);
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
    const server = src_1.app.get('server');
    server.close();
    (0, endpoint_tests_setup_1.closeTestDb)(dbClient);
});
