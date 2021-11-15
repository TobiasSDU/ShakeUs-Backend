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
const uuid_generator_1 = require("../../src/util/uuid_generator");
const endpoint_tests_setup_1 = require("./endpoint_tests_setup");
const database_connection_1 = require("../../config/database_connection");
const party_seed_1 = require("./../seed/party.seed");
const party_test_helpers_1 = require("../helpers/party_test_helpers");
const guest_test_helpers_1 = require("../helpers/guest_test_helpers");
const party_test_helpers_2 = require("./../helpers/party_test_helpers");
const src_1 = require("../../src");
const activity_pack_seed_1 = require("../seed/activity_pack.seed");
const activity_seed_1 = require("../seed/activity.seed");
const guest_seed_1 = require("../seed/guest.seed");
const guest_seed_2 = require("./../seed/guest.seed");
const mongodb_1 = require("mongodb");
const activity_pack_seed_2 = require("./../seed/activity_pack.seed");
let dbClient;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, database_connection_1.setCurrentDbMode)('testFile1');
    dbClient = new mongodb_1.MongoClient((0, database_connection_1.getDbConnectionString)());
    yield (0, endpoint_tests_setup_1.connectToTestDb)(dbClient, 'shake-us-test-1');
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, activity_seed_1.seedActivityCollection)();
    yield (0, activity_pack_seed_1.seedActivityPackCollection)();
    yield (0, guest_seed_2.seedGuestsCollection)();
    yield (0, party_seed_1.seedPartiesCollection)();
}));
describe('endpoint tests for Party routes using GET', () => {
    test('GET request to /party/:partyId/:guestId with an invalid user id does not return a party', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, party_test_helpers_2.getTestParty)(party_seed_1.testParty2.id, 'invalidId');
        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    }));
    test('GET request to /party/:partyId/:guestId with a vailid guest id returns a party', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, party_test_helpers_2.getTestParty)(party_seed_1.testParty1.id, party_seed_1.testParty1.getGuests[0]);
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(party_seed_1.testParty1.id);
    }));
    test('GET request to /party/:partyId/:guestId with a valid host id returns a party', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield endpoint_tests_setup_1.req
            .get(`/party/${party_seed_1.testParty2.id}/${party_seed_1.testParty2.getHosts[0]}`)
            .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(party_seed_1.testParty2.id);
    }));
});
describe('endpoint tests for Party routes using POST', () => {
    test('POST request to /party creates a party and a host', () => __awaiter(void 0, void 0, void 0, function* () {
        const activityPackId = activity_pack_seed_2.testActivityPack1.id;
        const hostName = 'TestHost';
        const hostNotificationToken = 'TestToken';
        const res = yield endpoint_tests_setup_1.req.post('/party').send({
            activityPackId: activityPackId,
            hostName: hostName,
            hostNotificationToken: hostNotificationToken,
        });
        const partyId = res.body.partyId;
        const hostId = res.body.hostId;
        yield (0, party_test_helpers_1.testParty)(partyId, [hostId], hostId, []);
        yield (0, guest_test_helpers_1.testHostOrGuest)(hostId, hostName);
        expect(res.body.hostNotificationToken).toEqual(hostNotificationToken);
    }));
    test('POST request to /party/add-host adds a new host to the hosts array', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty1.id;
        const hostId = party_seed_1.testParty1.getHosts[0];
        const newHostId = 'NewHostId';
        let party = yield (0, party_test_helpers_2.getTestParty)(partyId, party_seed_1.testParty1.getGuests[0]);
        expect(party.body.hosts).toEqual(expect.not.arrayContaining([newHostId]));
        const res = yield endpoint_tests_setup_1.req.post('/party/add-host').send({
            partyId: partyId,
            hostId: hostId,
            newHostId: newHostId,
        });
        expect(res.statusCode).toEqual(200);
        party = yield (0, party_test_helpers_2.getTestParty)(partyId, party_seed_1.testParty1.getGuests[0]);
        expect(party.body.hosts).toEqual(expect.arrayContaining([newHostId]));
    }));
    test('POST request to /party/remove-host removes a host from the hosts array', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty2.id;
        const primaryHostId = party_seed_1.testParty2.getPrimaryHost;
        const removedHostId = party_seed_1.testParty2.getHosts[1];
        let party = yield (0, party_test_helpers_2.getTestParty)(partyId, party_seed_1.testParty2.getGuests[0]);
        expect(party.body.hosts).toEqual(expect.arrayContaining([removedHostId]));
        const res = yield endpoint_tests_setup_1.req.post('/party/remove-host').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
            removedHostId: removedHostId,
        });
        expect(res.statusCode).toEqual(200);
        party = yield (0, party_test_helpers_2.getTestParty)(partyId, party_seed_1.testParty2.getGuests[0]);
        expect(party.body.hosts).toEqual(expect.not.arrayContaining([removedHostId]));
    }));
    test('POST request to /party/remove-guest removes a guest from the guests array', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty2.id;
        const hostId = party_seed_1.testParty2.getPrimaryHost;
        const removedGuestId = party_seed_1.testParty2.getGuests[1];
        let party = yield (0, party_test_helpers_2.getTestParty)(partyId, party_seed_1.testParty2.getPrimaryHost);
        expect(party.body.guests).toEqual(expect.arrayContaining([removedGuestId]));
        const res = yield endpoint_tests_setup_1.req.post('/party/remove-guest').send({
            partyId: partyId,
            hostId: hostId,
            removedGuestId: removedGuestId,
        });
        expect(res.statusCode).toEqual(200);
        party = yield (0, party_test_helpers_2.getTestParty)(partyId, party_seed_1.testParty2.getPrimaryHost);
        expect(party.body.guests).toEqual(expect.not.arrayContaining([removedGuestId]));
    }));
    test('POST request to /party/join returns a new guest', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty1.id;
        const guestName = 'NewTestGuest';
        const guestNotificationToken = 'TestToken';
        const res = yield endpoint_tests_setup_1.req.post('/party/join').send({
            partyId: partyId,
            guestName: guestName,
            guestNotificationToken: guestNotificationToken,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.newGuest._id).toBeTruthy();
        expect(res.body.newGuest.name).toEqual(guestName);
        expect(res.body.newGuest.notificationToken).toEqual(guestNotificationToken);
        expect(res.body.guests.length).toEqual(2);
        expect(res.body.hosts.length).toEqual(1);
        expect(res.body.hosts[0].name).toEqual(guest_seed_1.testGuest2.getName);
        expect(res.body.primaryHost.name).toEqual(guest_seed_1.testGuest2.getName);
    }));
    test('POST request to /party/leave returns 400 if primary host attempts to leave', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty2.id;
        const userId = party_seed_1.testParty2.getPrimaryHost;
        const res = yield endpoint_tests_setup_1.req.post('/party/leave').send({
            partyId: partyId,
            userId: userId,
        });
        expect(res.statusCode).toEqual(400);
        const party = yield (0, party_test_helpers_2.getTestParty)(partyId, party_seed_1.testParty2.getGuests[0]);
        expect(party.body.primaryHost).toEqual(userId);
    }));
    test('POST request to /party/leave returns 200 if a non-primary host attempts to leave', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty2.id;
        const userId = party_seed_1.testParty2.getHosts[1];
        const res = yield endpoint_tests_setup_1.req.post('/party/leave').send({
            partyId: partyId,
            userId: userId,
        });
        expect(res.statusCode).toEqual(200);
        const party = yield (0, party_test_helpers_2.getTestParty)(partyId, party_seed_1.testParty2.getGuests[0]);
        expect(party.body.hosts).toEqual(expect.not.arrayContaining([userId]));
    }));
    test('POST request to /party/leave returns 200 if a guest attempts to leave', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty2.id;
        const userId = party_seed_1.testParty2.getGuests[1];
        const res = yield endpoint_tests_setup_1.req.post('/party/leave').send({
            partyId: partyId,
            userId: userId,
        });
        expect(res.statusCode).toEqual(200);
        const party = yield (0, party_test_helpers_2.getTestParty)(partyId, party_seed_1.testParty2.getGuests[0]);
        expect(party.body.guests).toEqual(expect.not.arrayContaining([userId]));
    }));
});
describe('endpoint tests for Party routes using PATCH', () => {
    test('PATCH request to /party updates the activityPackId field', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty2.id;
        const primaryHostId = party_seed_1.testParty2.getPrimaryHost;
        const newActivityPackId = (0, uuid_generator_1.generateUUID)();
        const res = yield endpoint_tests_setup_1.req.patch('/party').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
            newActivityPackId: newActivityPackId,
        });
        expect(res.statusCode).toEqual(200);
        const party = yield endpoint_tests_setup_1.req
            .get(`/party/${partyId}/${primaryHostId}`)
            .send();
        expect(party.body.activityPackId).toEqual(newActivityPackId);
    }));
    test('PATCH request to /party updates the primaryHost field', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty1.id;
        const primaryHostId = party_seed_1.testParty1.getPrimaryHost;
        const newPrimary = 'NewPrimaryHostId';
        const res = yield endpoint_tests_setup_1.req.patch('/party').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
            newPrimary: newPrimary,
        });
        expect(res.statusCode).toEqual(200);
        const party = yield (0, party_test_helpers_2.getTestParty)(partyId, party_seed_1.testParty1.getGuests[0]);
        expect(party.body.primaryHost).toEqual(newPrimary);
    }));
});
describe('endpoint tests for Party routes using DELETE', () => {
    test('DELETE request to /party deletes the requested party', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty2.id;
        const primaryHostId = party_seed_1.testParty2.getPrimaryHost;
        const res = yield endpoint_tests_setup_1.req.delete('/party').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
        });
        expect(res.statusCode).toEqual(200);
        const party = yield (0, party_test_helpers_2.getTestParty)(partyId, primaryHostId);
        expect(Object.keys(party.body).length).toEqual(0);
    }));
    test('DELETE request to /party from non-primary host does not delete the requested party', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty2.id;
        const nonPrimaryHostId = party_seed_1.testParty2.getHosts[1];
        const res = yield endpoint_tests_setup_1.req.delete('/party').send({
            partyId: partyId,
            primaryHostId: nonPrimaryHostId,
        });
        expect(res.statusCode).toEqual(400);
        const party = yield (0, party_test_helpers_2.getTestParty)(partyId, nonPrimaryHostId);
        expect(party.body._id).toEqual(partyId);
    }));
    test('DELETE request to /party from a guest does not delete the requested party', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty2.id;
        const guestId = party_seed_1.testParty2.getGuests[0];
        const res = yield endpoint_tests_setup_1.req.delete('/party').send({
            partyId: partyId,
            primaryHostId: guestId,
        });
        expect(res.statusCode).toEqual(400);
        const party = yield (0, party_test_helpers_2.getTestParty)(partyId, guestId);
        expect(party.body._id).toEqual(partyId);
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
