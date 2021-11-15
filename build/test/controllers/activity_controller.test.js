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
const database_connection_1 = require("../../config/database_connection");
const src_1 = require("../../src");
const activity_test_helpers_1 = require("../helpers/activity_test_helpers");
const activity_seed_1 = require("../seed/activity.seed");
const endpoint_tests_setup_1 = require("./endpoint_tests_setup");
const party_seed_1 = require("../seed/party.seed");
const activity_service_1 = require("./../../src/services/activity_service");
const party_seed_2 = require("./../seed/party.seed");
const guest_seed_1 = require("./../seed/guest.seed");
const activity_pack_seed_1 = require("../seed/activity_pack.seed");
const activity_pack_seed_2 = require("./../seed/activity_pack.seed");
const activity_pack_service_1 = require("./../../src/services/activity_pack_service");
const mongodb_1 = require("mongodb");
let dbClient;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, database_connection_1.setCurrentDbMode)('testFile4');
    dbClient = new mongodb_1.MongoClient((0, database_connection_1.getDbConnectionString)());
    yield (0, endpoint_tests_setup_1.connectToTestDb)(dbClient, 'shake-us-test-4');
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, activity_seed_1.seedActivityCollection)();
    yield (0, party_seed_2.seedPartiesCollection)();
    yield (0, guest_seed_1.seedGuestsCollection)();
    yield (0, activity_pack_seed_1.seedActivityPackCollection)();
}));
describe('endpoint tests for Activity routes using GET', () => {
    test('GET request to /activity returns an activity', () => __awaiter(void 0, void 0, void 0, function* () {
        const activityId = activity_seed_1.testActivity1.id;
        const res = yield endpoint_tests_setup_1.req.get(`/activity/${activityId}`).send();
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.title).toBeTruthy();
        expect(res.body.description).toBeTruthy();
        expect(res.body.startTime).toBeTruthy();
        expect(res.body._id).toEqual(activity_seed_1.testActivity1.id);
        expect(res.body.title).toEqual(activity_seed_1.testActivity1.getTitle);
        expect(res.body.description).toEqual(activity_seed_1.testActivity1.getDescription);
        expect(res.body.startTime).toEqual(activity_seed_1.testActivity1.getStartTime);
    }));
    test('GET request to /activity with an invalid id returns 404', () => __awaiter(void 0, void 0, void 0, function* () {
        const activityId = 'invalidId';
        const res = yield endpoint_tests_setup_1.req.get('/activity').send({
            activityId: activityId,
        });
        expect(res.statusCode).toEqual(404);
        expect(Object.keys(res.body).length).toEqual(0);
    }));
    test('GET request to /activity/next/:partyId/:userId returns the next activity to start', () => __awaiter(void 0, void 0, void 0, function* () {
        yield activity_pack_service_1.ActivityPackService.addActivityPackActivity(activity_pack_seed_2.testActivityPack1.id, activity_seed_1.testActivity2.id);
        yield activity_service_1.ActivityService.updateActivityStartTime(activity_seed_1.testActivity1.id, Date.now() - 1000);
        yield activity_service_1.ActivityService.updateActivityStartTime(activity_seed_1.testActivity2.id, Date.now() + 5000);
        const res = yield endpoint_tests_setup_1.req
            .get(`/activity/next/${party_seed_1.testParty1.id}/${party_seed_1.testParty1.getPrimaryHost}`)
            .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(activity_seed_1.testActivity2.id);
    }));
    test('GET request to /activity/get-all/:activityPackId return all activities in the provided activity pack', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield endpoint_tests_setup_1.req
            .get(`/activity/get-all/${activity_pack_seed_1.testActivityPack2.id}`)
            .send();
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
        expect(res.body[0]._id).toEqual(activity_seed_1.testActivity1.id);
        expect(res.body[1]._id).toEqual(activity_seed_1.testActivity2.id);
    }));
});
describe('endpoint tests for Activity routes using POST', () => {
    test('POST request to /activity creates an activity', () => __awaiter(void 0, void 0, void 0, function* () {
        const title = 'TestTitle';
        const description = 'TestDescription';
        const startTime = Date.now() + 60000;
        const res = yield endpoint_tests_setup_1.req.post('/activity').send({
            title: title,
            description: description,
            startTime: startTime,
        });
        expect(res.statusCode).toEqual(200);
        const id = res.body.activityId;
        expect(id).toBeTruthy();
        const activity = yield (0, activity_test_helpers_1.getTestActivity)(id);
        expect(activity.body.title).toEqual(title);
        expect(activity.body.description).toEqual(description);
        expect(activity.body.startTime).toEqual(startTime);
    }));
    test('POST request to /activity/postpone-one updtes the start time of an activity', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty1.id;
        const hostId = party_seed_1.testParty1.getPrimaryHost;
        const activityId = activity_seed_1.testActivity1.id;
        const delay = 15;
        let activity = yield (0, activity_test_helpers_1.getTestActivity)(activityId);
        if (activity) {
            const initialStartTime = activity.body.startTime;
            const res = yield endpoint_tests_setup_1.req.post(`/activity/postpone-one`).send({
                partyId: partyId,
                hostId: hostId,
                activityId: activityId,
                delay: delay,
            });
            expect(res.statusCode).toEqual(200);
            activity = yield (0, activity_test_helpers_1.getTestActivity)(activityId);
            const newStartTime = activity.body.startTime;
            expect(newStartTime - initialStartTime).toEqual(delay * 1000 * 60);
        }
    }));
    test('POST request to /activity/postpone-all updates the start time of all activities', () => __awaiter(void 0, void 0, void 0, function* () {
        const partyId = party_seed_1.testParty1.id;
        const hostId = party_seed_1.testParty1.getPrimaryHost;
        const delay = 15;
        let allActivities = yield activity_service_1.ActivityService.getPartyActivities(partyId, hostId);
        if (allActivities) {
            const initialStartTimes = allActivities.map((activity) => __awaiter(void 0, void 0, void 0, function* () {
                const a = yield activity_service_1.ActivityService.showActivity(activity);
                if (a)
                    return a.getStartTime;
                return null;
            }));
            const res = yield endpoint_tests_setup_1.req.post('/activity/postpone-all').send({
                partyId: partyId,
                hostId: hostId,
                delay: delay,
            });
            expect(res.statusCode).toEqual(200);
            allActivities = yield activity_service_1.ActivityService.getPartyActivities(partyId, hostId);
            if (allActivities) {
                const finalStartTimes = allActivities.map((activity) => __awaiter(void 0, void 0, void 0, function* () {
                    const a = yield activity_service_1.ActivityService.showActivity(activity);
                    if (a)
                        return a.getStartTime;
                    return null;
                }));
                for (let i = 0; i < allActivities.length; i++) {
                    const iTime = yield initialStartTimes[i];
                    const fTime = yield finalStartTimes[i];
                    if (iTime && fTime) {
                        expect(fTime - iTime).toEqual(delay * 1000 * 60);
                    }
                }
            }
        }
    }));
});
describe('endpoint tests for Activity routes using PATCH', () => {
    test('PATCH request to /activity updates the title field', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = activity_seed_1.testActivity1.id;
        const newTitle = 'NewTitle';
        const res = yield endpoint_tests_setup_1.req.patch('/activity').send({
            activityId: id,
            newTitle: newTitle,
        });
        expect(res.statusCode).toEqual(200);
        const activity = yield (0, activity_test_helpers_1.getTestActivity)(id);
        expect(activity.body.title).toEqual(newTitle);
    }));
    test('PATCH request to /activity updates the description field', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = activity_seed_1.testActivity1.id;
        const newDescription = 'NewDescription';
        const res = yield endpoint_tests_setup_1.req.patch('/activity').send({
            activityId: id,
            newDescription: newDescription,
        });
        expect(res.statusCode).toEqual(200);
        const activity = yield (0, activity_test_helpers_1.getTestActivity)(id);
        expect(activity.body.description).toEqual(newDescription);
    }));
    test('PATCH request to /activity updates the startTime field', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = activity_seed_1.testActivity1.id;
        const newStartTime = 'NewStartTime';
        const res = yield endpoint_tests_setup_1.req.patch('/activity').send({
            activityId: id,
            newStartTime: newStartTime,
        });
        expect(res.statusCode).toEqual(200);
        const activity = yield (0, activity_test_helpers_1.getTestActivity)(id);
        expect(activity.body.startTime).toEqual(newStartTime);
    }));
});
describe('endpoint tests for Activity routes using DELETE', () => {
    test('DELETE request to /activity deletes an activity', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = activity_seed_1.testActivity1.id;
        const res = yield endpoint_tests_setup_1.req.delete('/activity').send({
            activityId: id,
        });
        expect(res.statusCode).toEqual(200);
        const activity = yield (0, activity_test_helpers_1.getTestActivity)(id);
        expect(Object.keys(activity.body).length).toEqual(0);
    }));
    test('DELETE request to /activity with an invalid id returns 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = 'InvalidId';
        const res = yield endpoint_tests_setup_1.req.delete('/activity').send({
            activityId: id,
        });
        expect(res.statusCode).toEqual(400);
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
