import { setCurrentDbMode } from '../../config/database_connection';
import { app } from '../../src';
import { SocketService } from '../../src/services/socket_service';
import { getTestGuest } from '../helpers/guest_test_helpers';
import { seedGuestsCollection, testGuest1 } from '../seed/guest.seed';
import { dropDatabase, req } from './endpoint_tests_setup';
import http from 'http';

let server: http.Server;

beforeAll(() => {
    server = http.createServer(app);

    setCurrentDbMode('testFile2');
    app.set('socketService', new SocketService(server));
});

beforeEach(async () => {
    await seedGuestsCollection();
});

describe('endpoint tests for Guest routes using GET', () => {
    test('GET request to /guest/:guestId returns a guest', async () => {
        const guestId = testGuest1.id;

        const res = await req.get(`/guest/${guestId}`).send();

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body._id).toEqual(guestId);
        expect(res.body.name).toBeTruthy();
    });

    test('GET request to /guest/:guestId with an invalid guestId returns 400', async () => {
        const guestId = 'invalidId';

        const res = await req.get(`/guest/${guestId}`).send();

        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
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
    server.close();
});
