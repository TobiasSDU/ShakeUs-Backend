import {
    getDbConnectionString,
    setCurrentDbMode,
} from '../../config/database_connection';
import { app } from '../../src';
import { getTestGuest } from '../helpers/guest_test_helpers';
import {
    seedGuestsCollection,
    testGuest1,
    testGuest2,
} from '../seed/guest.seed';
import {
    closeTestDb,
    connectToTestDb,
    dropDatabase,
    req,
} from './endpoint_tests_setup';
import { testParty2 } from '../seed/party.seed';
import { seedPartiesCollection } from './../seed/party.seed';
import { testGuest3 } from './../seed/guest.seed';
import { MongoClient } from 'mongodb';

let dbClient: MongoClient;

beforeAll(async () => {
    setCurrentDbMode('testFile2');

    dbClient = new MongoClient(getDbConnectionString());
    await connectToTestDb(dbClient, 'shake-us-test-2');
});

beforeEach(async () => {
    await seedGuestsCollection();
    await seedPartiesCollection();
});

describe('endpoint tests for Guest routes using GET', () => {
    test('GET request to /guest/:guestId returns a guest', async () => {
        const guestId = testGuest1.id;

        const res = await req.get(`/guest/${guestId}`).send();

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body._id).toEqual(guestId);
        expect(res.body.name).toBeTruthy();
        expect(res.body.notificationToken).toEqual(
            testGuest1.getNotificationToken
        );
    });

    test('GET request to /guest/:guestId with an invalid guestId returns 400', async () => {
        const guestId = 'invalidId';

        const res = await req.get(`/guest/${guestId}`).send();

        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    });

    test('GET request to guest/get-all/:partyId/:userId returns all guests in a party', async () => {
        const partyId = testParty2.id;

        const res = await req
            .get(`/guest/get-all/${partyId}/${testGuest1.id}`)
            .send();

        expect(res.statusCode).toEqual(200);

        expect(res.body.guests.length).toEqual(2);
        expect(res.body.guests[0]._id).toEqual(testGuest1.id);
        expect(res.body.guests[0].name).toEqual(testGuest1.getName);
        expect(res.body.guests[1]._id).toEqual(testGuest2.id);
        expect(res.body.guests[1].name).toEqual(testGuest2.getName);

        expect(res.body.hosts.length).toEqual(1);
        expect(res.body.hosts[0]._id).toEqual(testGuest3.id);
        expect(res.body.hosts[0].name).toEqual(testGuest3.getName);
    });
});

describe('endpoint tests for Guest routes using PATCH', () => {
    test('PATCH request to /guest updates name field', async () => {
        const guestId = testGuest1.id;
        const newName = 'NewGuestName';

        const res = await req.patch('/guest').send({
            guestId: guestId,
            newName: newName,
        });

        expect(res.statusCode).toEqual(200);

        const guest = await getTestGuest(guestId);

        expect(guest.body._id).toEqual(guestId);
        expect(guest.body.name).toEqual(newName);
    });

    test('PATCH request to /guest updates notificationToken', async () => {
        const guestId = testGuest1.id;
        const newNotificationToken = 'TestToken';

        const res = await req.patch('/guest').send({
            guestId: guestId,
            newNotificationToken: newNotificationToken,
        });

        expect(res.statusCode).toEqual(200);

        const guest = await getTestGuest(guestId);

        expect(guest.body._id).toEqual(guestId);
        expect(guest.body.notificationToken).toEqual(newNotificationToken);
    });

    test('PATCH request to /guest with an invalid guestId returns 400', async () => {
        const guestId = 'invalidId';
        const newName = 'NewGuestName';

        const res = await req.patch('/guest').send({
            guestId: guestId,
            newName: newName,
        });

        expect(res.statusCode).toEqual(400);
    });
});

afterEach(async () => {
    await dropDatabase();
});

afterAll(() => {
    const server = app.get('server');
    server.close();
    closeTestDb(dbClient);
});
