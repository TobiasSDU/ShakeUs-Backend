import { setCurrentDbMode } from '../../config/database_connection';
import { app } from '../../src';
import { SocketService } from '../../src/services/socket_service';
import { getActivityPack } from '../helpers/activity_pack_test_helpers';
import {
    seedActivityPackCollection,
    testActivityPack1,
} from '../seed/activity_pack.seed';
import { dropDatabase, req } from './endpoint_tests_setup';
import http from 'http';
import { seedActivityCollection, testActivity1 } from './../seed/activity.seed';

let server: http.Server;

beforeAll(() => {
    server = http.createServer(app);

    setCurrentDbMode('testFile3');
    app.set('socketService', new SocketService(server));
});

beforeEach(async () => {
    await seedActivityCollection();
    await seedActivityPackCollection();
});

describe('endpoint tests for ActivityPack routes using GET', () => {
    test('GET request to /activity-pack returns an activity pack', async () => {
        const activityPackId = testActivityPack1.id;

        const res = await req.get(`/activity-pack/${activityPackId}`).send();

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.title).toBeTruthy();
        expect(res.body.description).toBeTruthy();
        expect(res.body.activities).toBeTruthy();
        expect(res.body._id).toEqual(testActivityPack1.id);
        expect(res.body.title).toEqual(testActivityPack1.getTitle);
        expect(res.body.description).toEqual(testActivityPack1.getDescription);
        expect(res.body.activities).toEqual(testActivityPack1.getActivities);
    });

    test('GET request to /activity-pack with an invalid id returns 400', async () => {
        const activityPackId = 'invalidId';

        const res = await req.get(`/activity-pack/${activityPackId}`).send();

        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    });
});

describe('endpoint tests for ActivityPack routes using POST', () => {
    test('POST request to /activity-pack creates an activity pack', async () => {
        const title = 'newTitle';
        const description = 'newDescription';

        const res = await req.post('/activity-pack').send({
            title: title,
            description: description,
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.activityPackId).toBeTruthy();

        const id = res.body.activityPackId;

        const activityPack = await getActivityPack(id);

        expect(activityPack.body._id).toEqual(id);
        expect(activityPack.body.title).toEqual(title);
        expect(activityPack.body.description).toEqual(description);
        expect(activityPack.body.activities).toEqual([]);
    });

    test('POST request to /activity-pack/add-activity adds an activity to the activities array', async () => {
        const id = testActivityPack1.id;
        const activityId = testActivity1.id;

        const res = await req.post('/activity-pack/add-activity').send({
            activityPackId: id,
            activityId: activityId,
        });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);

        expect(activityPack.body.activities).toEqual(
            expect.arrayContaining([activityId])
        );
    });

    test('POST request to /activity-pack/remove-activity removes an activity from the activities array', async () => {
        const id = testActivityPack1.id;
        const activityId = testActivityPack1.getActivities[0];

        const res = await req.post('/activity-pack/remove-activity').send({
            activityPackId: id,
            activityId: activityId,
        });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);

        expect(activityPack.body.activities).toEqual(
            expect.not.arrayContaining([activityId])
        );
    });

    test('POST request to /activity-pack/remove-all-activities removes all activities from the activities array', async () => {
        const id = testActivityPack1.id;

        const res = await req
            .post('/activity-pack/remove-all-activities')
            .send({
                activityPackId: id,
            });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);

        expect(activityPack.body.activities).toEqual([]);
    });
});

describe('endpoint tests for ActivityPack routes using PATCH', () => {
    test('PATCH request to /activity-pack updates the title field', async () => {
        const id = testActivityPack1.id;
        const newTitle = 'NewTitle';

        const res = await req.patch('/activity-pack').send({
            activityPackId: id,
            newTitle: newTitle,
        });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);

        expect(activityPack.body.title).toEqual(newTitle);
    });

    test('PATCH request to /activity-pack updates the description field', async () => {
        const id = testActivityPack1.id;
        const newDescription = 'NewDescription';

        const res = await req.patch('/activity-pack').send({
            activityPackId: id,
            newDescription: newDescription,
        });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);

        expect(activityPack.body.description).toEqual(newDescription);
    });
});

describe('endpoint tests for ActivityPack routes using DELETE', () => {
    test('DELETE request to /activity-pack deletes an activity pack', async () => {
        const id = testActivityPack1.id;

        const res = await req.delete('/activity-pack').send({
            activityPackId: id,
        });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);
        expect(Object.keys(activityPack.body).length).toEqual(0);
    });

    test('DELETE request to /activity-pack with an invalid id returns 400', async () => {
        const id = 'InvalidId';

        const res = await req.delete('/activity-pack').send({
            activityPackId: id,
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
