import { generateUUID } from '../../src/util/uuid_generator';
import { dropDatabase, req } from './endpoint_tests_setup';
import { setCurrentDbMode } from '../../config/database_connection';
import {
    seedPartiesCollection,
    testParty1,
    testParty2,
} from './../seed/party.seed';
import { testParty } from '../helpers/party_test_helpers';
import { testHostOrGuest } from '../helpers/guest_test_helpers';
import { getTestParty } from './../helpers/party_test_helpers';
import { app } from '../../src';
import { SocketService } from '../../src/services/socket_service';
import http from 'http';
import { seedActivityPackCollection } from '../seed/activity_pack.seed';
import { seedActivityCollection } from '../seed/activity.seed';

let server: http.Server;

beforeAll(() => {
    server = http.createServer(app);

    setCurrentDbMode('testFile1');
    app.set('socketService', new SocketService(server));
});

beforeEach(async () => {
    await seedActivityCollection();
    await seedActivityPackCollection();
    await seedPartiesCollection();
});

describe('endpoint tests for Party routes using GET', () => {
    test('GET request to /party with an invalid user id does not return a party', async () => {
        const res = await getTestParty(testParty2.id, 'invalidId');

        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    });

    test('GET request to /party with a vailid guest id returns a party', async () => {
        const res = await getTestParty(testParty1.id, testParty1.getGuests[0]);

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(testParty1.id);
    });

    test('GET request to /party with a valid host id returns a party', async () => {
        const res = await req
            .get(`/party/${testParty2.id}/${testParty2.getHosts[0]}`)
            .send();

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(testParty2.id);
    });
});

describe('endpoint tests for Party routes using POST', () => {
    test('POST request to /party creates a party and a host', async () => {
        const activityPackId = 'testId';
        const hostName = 'TestHost';

        const res = await req.post('/party').send({
            activityPackId: activityPackId,
            hostName: hostName,
        });

        const partyId = res.body.partyId;
        const hostId = res.body.hostId;

        await testParty(partyId, [hostId], hostId, []);
        await testHostOrGuest(hostId, hostName);
    });

    test('POST request to /party/add-host adds a new host to the hosts array', async () => {
        const partyId = testParty1.id;
        const hostId = testParty1.getHosts[0];
        const newHostId = 'NewHostId';

        let party = await getTestParty(partyId, testParty1.getGuests[0]);

        expect(party.body.hosts).toEqual(
            expect.not.arrayContaining([newHostId])
        );

        const res = await req.post('/party/add-host').send({
            partyId: partyId,
            hostId: hostId,
            newHostId: newHostId,
        });

        expect(res.statusCode).toEqual(200);

        party = await getTestParty(partyId, testParty1.getGuests[0]);

        expect(party.body.hosts).toEqual(expect.arrayContaining([newHostId]));
    });

    test('POST request to /party/remove-host removes a host from the hosts array', async () => {
        const partyId = testParty2.id;
        const primaryHostId = testParty2.getPrimaryHost;
        const removedHostId = testParty2.getHosts[1];

        let party = await getTestParty(partyId, testParty2.getGuests[0]);

        expect(party.body.hosts).toEqual(
            expect.arrayContaining([removedHostId])
        );

        const res = await req.post('/party/remove-host').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
            removedHostId: removedHostId,
        });

        expect(res.statusCode).toEqual(200);

        party = await getTestParty(partyId, testParty2.getGuests[0]);

        expect(party.body.hosts).toEqual(
            expect.not.arrayContaining([removedHostId])
        );
    });

    test('POST request to /party/remove-guest removes a guest from the guests array', async () => {
        const partyId = testParty2.id;
        const hostId = testParty2.getPrimaryHost;
        const removedGuestId = testParty2.getGuests[1];

        let party = await getTestParty(partyId, testParty2.getPrimaryHost);

        expect(party.body.guests).toEqual(
            expect.arrayContaining([removedGuestId])
        );

        const res = await req.post('/party/remove-guest').send({
            partyId: partyId,
            hostId: hostId,
            removedGuestId: removedGuestId,
        });

        expect(res.statusCode).toEqual(200);

        party = await getTestParty(partyId, testParty2.getPrimaryHost);

        expect(party.body.guests).toEqual(
            expect.not.arrayContaining([removedGuestId])
        );
    });

    test('POST request to /party/join returns a new guest', async () => {
        const partyId = testParty1.id;
        const guestName = 'NewTestGuest';

        const res = await req.post('/party/join').send({
            partyId: partyId,
            guestName: guestName,
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.name).toEqual(guestName);
    });

    test('POST request to /party/leave returns 400 if primary host attempts to leave', async () => {
        const partyId = testParty2.id;
        const userId = testParty2.getPrimaryHost;

        const res = await req.post('/party/leave').send({
            partyId: partyId,
            userId: userId,
        });

        expect(res.statusCode).toEqual(400);

        const party = await getTestParty(partyId, testParty2.getGuests[0]);

        expect(party.body.primaryHost).toEqual(userId);
    });

    test('POST request to /party/leave returns 200 if a non-primary host attempts to leave', async () => {
        const partyId = testParty2.id;
        const userId = testParty2.getHosts[1];

        const res = await req.post('/party/leave').send({
            partyId: partyId,
            userId: userId,
        });

        expect(res.statusCode).toEqual(200);

        const party = await getTestParty(partyId, testParty2.getGuests[0]);

        expect(party.body.hosts).toEqual(expect.not.arrayContaining([userId]));
    });

    test('POST request to /party/leave returns 200 if a guest attempts to leave', async () => {
        const partyId = testParty2.id;
        const userId = testParty2.getGuests[1];

        const res = await req.post('/party/leave').send({
            partyId: partyId,
            userId: userId,
        });

        expect(res.statusCode).toEqual(200);

        const party = await getTestParty(partyId, testParty2.getGuests[0]);

        expect(party.body.guests).toEqual(expect.not.arrayContaining([userId]));
    });
});

describe('endpoint tests for Party routes using PATCH', () => {
    test('PATCH request to /party updates the activityPackId field', async () => {
        const partyId = testParty2.id;
        const primaryHostId = testParty2.getPrimaryHost;
        const newActivityPackId = generateUUID();

        const res = await req.patch('/party').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
            newActivityPackId: newActivityPackId,
        });

        expect(res.statusCode).toEqual(200);

        const party = await req
            .get(`/party/${partyId}/${primaryHostId}`)
            .send();

        expect(party.body.activityPackId).toEqual(newActivityPackId);
    });

    test('PATCH request to /party updates the primaryHost field', async () => {
        const partyId = testParty1.id;
        const primaryHostId = testParty1.getPrimaryHost;
        const newPrimary = 'NewPrimaryHostId';

        const res = await req.patch('/party').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
            newPrimary: newPrimary,
        });

        expect(res.statusCode).toEqual(200);

        const party = await getTestParty(partyId, testParty1.getGuests[0]);

        expect(party.body.primaryHost).toEqual(newPrimary);
    });
});

describe('endpoint tests for Party routes using DELETE', () => {
    test('DELETE request to /party deletes the requested party', async () => {
        const partyId = testParty2.id;
        const primaryHostId = testParty2.getPrimaryHost;

        const res = await req.delete('/party').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
        });

        expect(res.statusCode).toEqual(200);

        const party = await getTestParty(partyId, primaryHostId);

        expect(Object.keys(party.body).length).toEqual(0);
    });

    test('DELETE request to /party from non-primary host does not delete the requested party', async () => {
        const partyId = testParty2.id;
        const nonPrimaryHostId = testParty2.getHosts[1];

        const res = await req.delete('/party').send({
            partyId: partyId,
            primaryHostId: nonPrimaryHostId,
        });

        expect(res.statusCode).toEqual(400);

        const party = await getTestParty(partyId, nonPrimaryHostId);

        expect(party.body._id).toEqual(partyId);
    });

    test('DELETE request to /party from a guest does not delete the requested party', async () => {
        const partyId = testParty2.id;
        const guestId = testParty2.getGuests[0];

        const res = await req.delete('/party').send({
            partyId: partyId,
            primaryHostId: guestId,
        });

        expect(res.statusCode).toEqual(400);

        const party = await getTestParty(partyId, guestId);

        expect(party.body._id).toEqual(partyId);
    });
});

afterEach(async () => {
    await dropDatabase();
});

afterAll(() => {
    server.close();
});
