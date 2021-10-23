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

describe('endpoint tests for Party routes using GET', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile1');
    });

    beforeEach(async () => {
        await seedPartiesCollection();
    });

    test('GET request to /party/show with an invalid user id does not return a party', async () => {
        const res = await getTestParty(testParty2.id, 'invalidId');

        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    });

    test('GET request to /party/show with a vailid guest id returns a party', async () => {
        const res = await getTestParty(testParty1.id, testParty1.guests[0]);

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(testParty1.id);
    });

    test('GET request to /party/show with a valid host id returns a party', async () => {
        const res = await req.get('/party/show').send({
            partyId: testParty2.id,
            guestId: testParty2.hosts[0],
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(testParty2.id);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});

describe('endpoint tests for Party routes using POST', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile1');
    });

    beforeEach(async () => {
        await seedPartiesCollection();
    });

    test('POST request to /party/create creates a party and a host', async () => {
        const activityPackId = generateUUID();
        const hostName = 'TestHost';

        const res = await req.post('/party/create').send({
            activityPackId: activityPackId,
            hostName: hostName,
        });

        const partyId = res.body.partyId;
        const hostId = res.body.hostId;

        await testParty(partyId, [hostId], hostId, [], activityPackId);
        await testHostOrGuest(hostId, hostName);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});

describe('endpoint tests for Party routes using PATCH', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile1');
    });

    beforeEach(async () => {
        await seedPartiesCollection();
    });

    test('PATCH request to /party/activity-pack/update updates the activityPackId field', async () => {
        const partyId = testParty2.id;
        const primaryHostId = testParty2.primaryHost;
        const newActivityPackId = generateUUID();

        const res = await req.patch('/party/activity-pack/update').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
            newActivityPackId: newActivityPackId,
        });

        expect(res.statusCode).toEqual(200);

        const party = await req.get('/party/show').send({
            partyId: partyId,
            guestId: primaryHostId,
        });

        expect(party.body._activityPackId).toEqual(newActivityPackId);
    });

    test('PATCH request to /party/hosts/primary/update updates the primaryHost field', async () => {
        const partyId = testParty1.id;
        const currentPrimary = testParty1.primaryHost;
        const newPrimary = 'NewPrimaryHostId';

        const res = await req.patch('/party/hosts/primary/update').send({
            partyId: partyId,
            currentPrimary: currentPrimary,
            newPrimary: newPrimary,
        });

        expect(res.statusCode).toEqual(200);

        const party = await getTestParty(partyId, testParty1.guests[0]);

        expect(party.body._primaryHost).toEqual(newPrimary);
    });

    test('PATCH request to /party/hosts/add adds a new host to the hosts array', async () => {
        const partyId = testParty1.id;
        const hostId = testParty1.hosts[0];
        const newHostId = 'NewHostId';

        let party = await getTestParty(partyId, testParty1.guests[0]);

        expect(party.body._hosts).toEqual(
            expect.not.arrayContaining([newHostId])
        );

        const res = await req.patch('/party/hosts/add').send({
            partyId: partyId,
            hostId: hostId,
            newHostId: newHostId,
        });

        expect(res.statusCode).toEqual(200);

        party = await getTestParty(partyId, testParty1.guests[0]);

        expect(party.body._hosts).toEqual(expect.arrayContaining([newHostId]));
    });

    test('PATCH request to /party/hosts/remove removes a host from the hosts array', async () => {
        const partyId = testParty2.id;
        const primaryHostId = testParty2.primaryHost;
        const removedHostId = testParty2.hosts[1];

        let party = await getTestParty(partyId, testParty2.guests[0]);

        expect(party.body._hosts).toEqual(
            expect.arrayContaining([removedHostId])
        );

        const res = await req.patch('/party/hosts/remove').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
            removedHostId: removedHostId,
        });

        expect(res.statusCode).toEqual(200);

        party = await getTestParty(partyId, testParty2.guests[0]);

        expect(party.body._hosts).toEqual(
            expect.not.arrayContaining([removedHostId])
        );
    });

    test('PATCH request to /party/guests/remove removes a guest from the guests array', async () => {
        const partyId = testParty2.id;
        const hostId = testParty2.primaryHost;
        const removedGuestId = testParty2.guests[1];

        let party = await getTestParty(partyId, testParty2.primaryHost);

        expect(party.body._guests).toEqual(
            expect.arrayContaining([removedGuestId])
        );

        const res = await req.patch('/party/guests/remove').send({
            partyId: partyId,
            hostId: hostId,
            removedGuestId: removedGuestId,
        });

        expect(res.statusCode).toEqual(200);

        party = await getTestParty(partyId, testParty2.primaryHost);

        expect(party.body._guests).toEqual(
            expect.not.arrayContaining([removedGuestId])
        );
    });

    test('PATCH request to /party/join returns a new guest', async () => {
        const partyId = testParty1.id;
        const guestName = 'NewTestGuest';

        const res = await req.patch('/party/join').send({
            partyId: partyId,
            guestName: guestName,
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body._name).toEqual(guestName);
    });

    test('PATCH request to /party/leave returns 400 if primary host attempts to leave', async () => {
        const partyId = testParty2.id;
        const userId = testParty2.primaryHost;

        const res = await req.patch('/party/leave').send({
            partyId: partyId,
            userId: userId,
        });

        expect(res.statusCode).toEqual(400);

        const party = await getTestParty(partyId, testParty2.guests[0]);

        expect(party.body._primaryHost).toEqual(userId);
    });

    test('PATCH request to /party/leave returns 200 if a non-primary host attempts to leave', async () => {
        const partyId = testParty2.id;
        const userId = testParty2.hosts[1];

        const res = await req.patch('/party/leave').send({
            partyId: partyId,
            userId: userId,
        });

        expect(res.statusCode).toEqual(200);

        const party = await getTestParty(partyId, testParty2.guests[0]);

        expect(party.body._hosts).toEqual(expect.not.arrayContaining([userId]));
    });

    test('PATCH request to /party/leave returns 200 if a guest attempts to leave', async () => {
        const partyId = testParty2.id;
        const userId = testParty2.guests[1];

        const res = await req.patch('/party/leave').send({
            partyId: partyId,
            userId: userId,
        });

        expect(res.statusCode).toEqual(200);

        const party = await getTestParty(partyId, testParty2.guests[0]);

        expect(party.body._guests).toEqual(
            expect.not.arrayContaining([userId])
        );
    });

    afterEach(async () => {
        await dropDatabase();
    });
});

describe('endpoint tests for Party routes using DELETE', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile1');
    });

    beforeEach(async () => {
        await seedPartiesCollection();
    });

    test('DELETE request to /party/delete deletes the requested party', async () => {
        const partyId = testParty2.id;
        const primaryHostId = testParty2.primaryHost;

        const res = await req.delete('/party/delete').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
        });

        expect(res.statusCode).toEqual(200);

        const party = await getTestParty(partyId, primaryHostId);

        expect(Object.keys(party.body).length).toEqual(0);
    });

    test('DELETE request to /party/delete from non-primary host does not delete the requested party', async () => {
        const partyId = testParty2.id;
        const nonPrimaryHostId = testParty2.hosts[1];

        const res = await req.delete('/party/delete').send({
            partyId: partyId,
            primaryHostId: nonPrimaryHostId,
        });

        expect(res.statusCode).toEqual(400);

        const party = await getTestParty(partyId, nonPrimaryHostId);

        expect(party.body._id).toEqual(partyId);
    });

    test('DELETE request to /party/delete from a guest does not delete the requested party', async () => {
        const partyId = testParty2.id;
        const guestId = testParty2.guests[0];

        const res = await req.delete('/party/delete').send({
            partyId: partyId,
            primaryHostId: guestId,
        });

        expect(res.statusCode).toEqual(400);

        const party = await getTestParty(partyId, guestId);

        expect(party.body._id).toEqual(partyId);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});
