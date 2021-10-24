import { setCurrentDbMode } from '../../config/database_connection';
import { getActivityPack } from '../helpers/activity_pack_test_helpers';
import {
    seedActivityPackCollection,
    testActivityPack1,
} from '../seed/activity_pack.seed';
import { dropDatabase, req } from './endpoint_tests_setup';

describe('endpoint tests for ActivityPack routes using GET', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile3');
    });

    beforeEach(async () => {
        await seedActivityPackCollection();
    });

    test('GET request to /activity-pack/show returns an activity pack', async () => {
        const activityPackId = testActivityPack1.id;

        const res = await req.get('/activity-pack/show').send({
            id: activityPackId,
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.title).toBeTruthy();
        expect(res.body.description).toBeTruthy();
        expect(res.body._activities).toBeTruthy();
        expect(res.body._id).toEqual(testActivityPack1.id);
        expect(res.body.title).toEqual(testActivityPack1.getTitle);
        expect(res.body.description).toEqual(testActivityPack1.getDescription);
        expect(res.body._activities).toEqual(testActivityPack1.activities);
    });

    test('GET request to /activity-pack/show with an invalid id returns 400', async () => {
        const activityPackId = 'invalidId';

        const res = await req.get('/activity-pack/show').send({
            id: activityPackId,
        });

        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});

describe('endpoint tests for ActivityPack routes using POST', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile3');
    });

    beforeEach(async () => {
        await seedActivityPackCollection();
    });

    test('POST request to /activity-pack/create creates an activity pack', async () => {
        const title = 'newTitle';
        const description = 'newDescription';

        const res = await req.post('/activity-pack/create').send({
            title: title,
            description: description,
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toBeTruthy();

        const id = res.body.id;

        const activityPack = await getActivityPack(id);

        expect(activityPack.body._id).toEqual(id);
        expect(activityPack.body.title).toEqual(title);
        expect(activityPack.body.description).toEqual(description);
        expect(activityPack.body._activities).toEqual([]);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});

describe('endpoint tests for ActivityPack routes using PATCH', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile3');
    });

    beforeEach(async () => {
        await seedActivityPackCollection();
    });

    test('PATCH request to /activity-pack/title/update updates the title field', async () => {
        const id = testActivityPack1.id;
        const newTitle = 'NewTitle';

        const res = await req.patch('/activity-pack/title/update').send({
            id: id,
            newTitle: newTitle,
        });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);

        expect(activityPack.body.title).toEqual(newTitle);
    });

    test('PATCH request to /activity-pack/description/update updates the description field', async () => {
        const id = testActivityPack1.id;
        const newDescription = 'NewDescription';

        const res = await req.patch('/activity-pack/description/update').send({
            id: id,
            newDescription: newDescription,
        });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);

        expect(activityPack.body.description).toEqual(newDescription);
    });

    afterEach(async () => {
        await dropDatabase();
    });

    test('PATCH request to /activity-pack/activities/add adds an activity to the activities array', async () => {
        const id = testActivityPack1.id;
        const activityId = 'NewActivityId';

        const res = await req.patch('/activity-pack/activities/add').send({
            id: id,
            activityId: activityId,
        });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);

        expect(activityPack.body._activities).toEqual(
            expect.arrayContaining([activityId])
        );
    });

    test('PATCH request to /activity-pack/activities/remove removes an activity from the activities array', async () => {
        const id = testActivityPack1.id;
        const activityId = testActivityPack1.activities[0];

        const res = await req.patch('/activity-pack/activities/remove').send({
            id: id,
            activityId: activityId,
        });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);

        expect(activityPack.body._activities).toEqual(
            expect.not.arrayContaining([activityId])
        );
    });

    test('PATCH request to /activity-pack/activities/remove-all removes all activities from the activities array', async () => {
        const id = testActivityPack1.id;

        const res = await req
            .patch('/activity-pack/activities/remove-all')
            .send({
                id: id,
            });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);

        expect(activityPack.body._activities).toEqual([]);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});

describe('endpoint tests for ActivityPack routes using DELETE', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile3');
    });

    beforeEach(async () => {
        await seedActivityPackCollection();
    });

    test('DELETE request to /activity-pack/delete deletes an activity pack', async () => {
        const id = testActivityPack1.id;

        const res = await req.delete('/activity-pack/delete').send({
            id: id,
        });

        expect(res.statusCode).toEqual(200);

        const activityPack = await getActivityPack(id);
        expect(Object.keys(activityPack.body).length).toEqual(0);
    });

    test('DELETE request to /activity-pack/delete with an invalid id returns 400', async () => {
        const id = 'InvalidId';

        const res = await req.delete('/activity-pack/delete').send({
            id: id,
        });

        expect(res.statusCode).toEqual(400);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});
