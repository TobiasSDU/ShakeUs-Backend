import { setCurrentDbMode } from '../../config/database_connection';
import { app } from '../../src';
import { SocketService } from '../../src/services/socket_service';
import { getTestActivity } from '../helpers/activity_test_helpers';
import { seedActivityCollection, testActivity1 } from '../seed/activity.seed';
import { dropDatabase, req } from './endpoint_tests_setup';
import http from 'http';
import { testParty1 } from '../seed/party.seed';
import { ActivityService } from './../../src/services/activity_service';
import { seedPartiesCollection } from './../seed/party.seed';
import { seedGuestsCollection } from './../seed/guest.seed';
import { seedActivityPackCollection } from '../seed/activity_pack.seed';

let server: http.Server;

beforeAll(() => {
    server = http.createServer(app);

    setCurrentDbMode('testFile4');
    app.set('socketService', new SocketService(server));
});

beforeEach(async () => {
    await seedActivityCollection();
    await seedPartiesCollection();
    await seedGuestsCollection();
    await seedActivityPackCollection();
});

describe('endpoint tests for Activity routes using GET', () => {
    test('GET request to /activity returns an activity', async () => {
        const activityId = testActivity1.id;

        const res = await req.get(`/activity/${activityId}`).send();

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.title).toBeTruthy();
        expect(res.body.description).toBeTruthy();
        expect(res.body.startTime).toBeTruthy();
        expect(res.body._id).toEqual(testActivity1.id);
        expect(res.body.title).toEqual(testActivity1.getTitle);
        expect(res.body.description).toEqual(testActivity1.getDescription);
        expect(res.body.startTime).toEqual(testActivity1.getStartTime);
    });

    test('GET request to /activity with an invalid id returns 404', async () => {
        const activityId = 'invalidId';

        const res = await req.get('/activity').send({
            activityId: activityId,
        });

        expect(res.statusCode).toEqual(404);
        expect(Object.keys(res.body).length).toEqual(0);
    });
});

describe('endpoint tests for Activity routes using POST', () => {
    test('POST request to /activity returns an activity', async () => {
        const title = 'TestTitle';
        const description = 'TestDescription';
        const startTime = 1635082733652;

        const res = await req.post('/activity').send({
            title: title,
            description: description,
            startTime: startTime,
        });

        expect(res.statusCode).toEqual(200);

        const id = res.body.activityId;
        expect(id).toBeTruthy();

        const activity = await getTestActivity(id);

        expect(activity.body.title).toEqual(title);
        expect(activity.body.description).toEqual(description);
        expect(activity.body.startTime).toEqual(startTime);
    });

    test('POST request to /activity/postpone-all updates the start time of all activities', async () => {
        const partyId = testParty1.id;
        const hostId = testParty1.getPrimaryHost;
        const delay = 15;

        let allActivities = await ActivityService.getPartyActivities(
            partyId,
            hostId
        );

        if (allActivities) {
            const initialStartTimes = allActivities.map(async (activity) => {
                const a = await ActivityService.showActivity(activity);
                if (a) return a.getStartTime;
                return null;
            });

            const res = await req.post('/activity/postpone-all').send({
                partyId: partyId,
                hostId: hostId,
                delay: delay,
            });

            expect(res.statusCode).toEqual(200);

            allActivities = await ActivityService.getPartyActivities(
                partyId,
                hostId
            );

            if (allActivities) {
                const finalStartTimes = allActivities.map(async (activity) => {
                    const a = await ActivityService.showActivity(activity);
                    if (a) return a.getStartTime;
                    return null;
                });

                for (let i = 0; i < allActivities.length; i++) {
                    const iTime = await initialStartTimes[i];
                    const fTime = await finalStartTimes[i];
                    if (iTime && fTime) {
                        expect(fTime - iTime).toEqual(delay * 1000 * 60);
                    }
                }
            }
        }
    });
});

describe('endpoint tests for Activity routes using PATCH', () => {
    test('PATCH request to /activity updates the title field', async () => {
        const id = testActivity1.id;
        const newTitle = 'NewTitle';

        const res = await req.patch('/activity').send({
            activityId: id,
            newTitle: newTitle,
        });

        expect(res.statusCode).toEqual(200);

        const activity = await getTestActivity(id);

        expect(activity.body.title).toEqual(newTitle);
    });

    test('PATCH request to /activity updates the description field', async () => {
        const id = testActivity1.id;
        const newDescription = 'NewDescription';

        const res = await req.patch('/activity').send({
            activityId: id,
            newDescription: newDescription,
        });

        expect(res.statusCode).toEqual(200);

        const activity = await getTestActivity(id);

        expect(activity.body.description).toEqual(newDescription);
    });

    test('PATCH request to /activity updates the startTime field', async () => {
        const id = testActivity1.id;
        const newStartTime = 'NewStartTime';

        const res = await req.patch('/activity').send({
            activityId: id,
            newStartTime: newStartTime,
        });

        expect(res.statusCode).toEqual(200);

        const activity = await getTestActivity(id);

        expect(activity.body.startTime).toEqual(newStartTime);
    });
});

describe('endpoint tests for Activity routes using DELETE', () => {
    test('DELETE request to /activity deletes an activity', async () => {
        const id = testActivity1.id;

        const res = await req.delete('/activity').send({
            activityId: id,
        });

        expect(res.statusCode).toEqual(200);

        const activity = await getTestActivity(id);

        expect(Object.keys(activity.body).length).toEqual(0);
    });

    test('DELETE request to /activity with an invalid id returns 400', async () => {
        const id = 'InvalidId';

        const res = await req.delete('/activity').send({
            activityId: id,
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
