import { setCurrentDbMode } from '../../config/database_connection';
import { getTestActivity } from '../helpers/activity_test_helpers';
import { seedActivityCollection, testActivity1 } from '../seed/activity.seed';
import { dropDatabase, req } from './endpoint_tests_setup';

describe('endpoint tests for Activity routes using GET', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile4');
    });

    beforeEach(async () => {
        await seedActivityCollection();
    });

    test('GET request to /activity/show returns an activity', async () => {
        const activityId = testActivity1.id;

        const res = await req.get('/activity/show').send({
            id: activityId,
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body._title).toBeTruthy();
        expect(res.body._description).toBeTruthy();
        expect(res.body._startTime).toBeTruthy();
        expect(res.body._id).toEqual(testActivity1.id);
        expect(res.body._title).toEqual(testActivity1.title);
        expect(res.body._description).toEqual(testActivity1.description);
        expect(res.body._startTime).toEqual(testActivity1.startTime);
    });

    test('GET request to /activity/show with an invalid id returns 400', async () => {
        const activityId = 'invalidId';

        const res = await req.get('/activity/show').send({
            id: activityId,
        });

        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});

describe('endpoint tests for Activity routes using POST', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile4');
    });

    beforeEach(async () => {
        await seedActivityCollection();
    });

    test('POST request to /activity/show returns an activity', async () => {
        const title = 'TestTitle';
        const description = 'TestDescription';
        const startTime = 1635082733652;

        const res = await req.post('/activity/create').send({
            title: title,
            description: description,
            startTime: startTime,
        });

        expect(res.statusCode).toEqual(200);

        const id = res.body.id;
        expect(id).toBeTruthy();

        const activity = await getTestActivity(id);

        expect(activity.body._title).toEqual(title);
        expect(activity.body._description).toEqual(description);
        expect(activity.body._startTime).toEqual(startTime);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});

describe('endpoint tests for Activity routes using PATCH', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile4');
    });

    beforeEach(async () => {
        await seedActivityCollection();
    });

    test('PATCH request to /activity/title/update updates the title field', async () => {
        const id = testActivity1.id;
        const newTitle = 'NewTitle';

        const res = await req.patch('/activity/title/update').send({
            id: id,
            newTitle: newTitle,
        });

        expect(res.statusCode).toEqual(200);

        const activity = await getTestActivity(id);

        expect(activity.body._title).toEqual(newTitle);
    });

    test('PATCH request to /activity/description/update updates the description field', async () => {
        const id = testActivity1.id;
        const newDescription = 'NewDescription';

        const res = await req.patch('/activity/description/update').send({
            id: id,
            newDescription: newDescription,
        });

        expect(res.statusCode).toEqual(200);

        const activity = await getTestActivity(id);

        expect(activity.body._description).toEqual(newDescription);
    });

    test('PATCH request to /activity/start-time/update updates the startTime field', async () => {
        const id = testActivity1.id;
        const newStartTime = 'NewStartTime';

        const res = await req.patch('/activity/start-time/update').send({
            id: id,
            newStartTime: newStartTime,
        });

        expect(res.statusCode).toEqual(200);

        const activity = await getTestActivity(id);

        expect(activity.body._startTime).toEqual(newStartTime);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});

describe('endpoint tests for Activity routes using DELETE', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile4');
    });

    beforeEach(async () => {
        await seedActivityCollection();
    });

    test('DELETE request to /activity/delete deletes an activity', async () => {
        const id = testActivity1.id;

        const res = await req.delete('/activity/delete').send({
            id: id,
        });

        expect(res.statusCode).toEqual(200);

        const activity = await getTestActivity(id);

        expect(Object.keys(activity.body).length).toEqual(0);
    });

    test('DELETE request to /activity/delete with an invalid id returns 400', async () => {
        const id = 'InvalidId';

        const res = await req.delete('/activity/delete').send({
            id: id,
        });

        expect(res.statusCode).toEqual(400);
    });

    afterEach(async () => {
        await dropDatabase();
    });
});