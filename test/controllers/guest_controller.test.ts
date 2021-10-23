import { setCurrentDbMode } from '../../config/database_connection';
import { getTestGuest } from '../helpers/guest_test_helpers';
import { seedGuestsCollection, testGuest1 } from '../seed/guest.seed';
import { dropDatabase, req } from './endpoint_tests_setup';

describe('endpoint tests for Guest routes using GET', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile2');
    });

    beforeEach(async () => {
        await seedGuestsCollection();
    });

    test('GET request to /guest/show returns a guest', async () => {
        const guestId = testGuest1.id;

        const res = await req.get('/guest/show').send({
            guestId: guestId,
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body._id).toEqual(guestId);
        expect(res.body._name).toBeTruthy();
    });

    test('GET request to /guest/show with an invalid guestId returns 400', async () => {
        const guestId = 'invalidId';

        const res = await req.get('/guest/show').send({
            guestId: guestId,
        });

        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});

describe('endpoint tests for Guest routes using PATCH', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile2');
    });

    beforeEach(async () => {
        await seedGuestsCollection();
    });

    test('PATCH request to /guest/name/update updates name field', async () => {
        const guestId = testGuest1.id;
        const newName = 'NewGuestName';

        const res = await req.patch('/guest/name/update').send({
            guestId: guestId,
            newName: newName,
        });

        expect(res.statusCode).toEqual(200);

        const guest = await getTestGuest(guestId);

        expect(guest.body._id).toEqual(guestId);
        expect(guest.body._name).toEqual(newName);
    });

    test('PATCH request to /guest/name/update with an invalid guestId returns 400', async () => {
        const guestId = 'invalidId';
        const newName = 'NewGuestName';

        const res = await req.patch('/guest/name/update').send({
            guestId: guestId,
            newName: newName,
        });

        expect(res.statusCode).toEqual(400);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});
