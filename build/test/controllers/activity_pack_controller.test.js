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
const activity_pack_test_helpers_1 = require("../helpers/activity_pack_test_helpers");
const activity_pack_seed_1 = require("../seed/activity_pack.seed");
const endpoint_tests_setup_1 = require("./endpoint_tests_setup");
const activity_seed_1 = require("./../seed/activity.seed");
const mongodb_1 = require("mongodb");
let dbClient;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    (0, database_connection_1.setCurrentDbMode)('testFile3');
    dbClient = new mongodb_1.MongoClient((0, database_connection_1.getDbConnectionString)());
    yield (0, endpoint_tests_setup_1.connectToTestDb)(dbClient, 'shake-us-test-3');
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, activity_seed_1.seedActivityCollection)();
    yield (0, activity_pack_seed_1.seedActivityPackCollection)();
}));
describe('endpoint tests for ActivityPack routes using GET', () => {
    test('GET request to /activity-pack/:activityPackId returns an activity pack', () => __awaiter(void 0, void 0, void 0, function* () {
        const activityPackId = activity_pack_seed_1.testActivityPack1.id;
        const res = yield endpoint_tests_setup_1.req.get(`/activity-pack/${activityPackId}`).send();
        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toBeTruthy();
        expect(res.body.title).toBeTruthy();
        expect(res.body.description).toBeTruthy();
        expect(res.body.activities).toBeTruthy();
        expect(res.body._id).toEqual(activity_pack_seed_1.testActivityPack1.id);
        expect(res.body.title).toEqual(activity_pack_seed_1.testActivityPack1.getTitle);
        expect(res.body.description).toEqual(activity_pack_seed_1.testActivityPack1.getDescription);
        expect(res.body.activities).toEqual(activity_pack_seed_1.testActivityPack1.getActivities);
    }));
    test('GET request to /activity-pack/:activityPackId with an invalid id returns 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const activityPackId = 'invalidId';
        const res = yield endpoint_tests_setup_1.req.get(`/activity-pack/${activityPackId}`).send();
        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    }));
});
describe('endpoint tests for ActivityPack routes using POST', () => {
    test('POST request to /activity-pack creates an activity pack', () => __awaiter(void 0, void 0, void 0, function* () {
        const title = 'newTitle';
        const description = 'newDescription';
        const res = yield endpoint_tests_setup_1.req.post('/activity-pack').send({
            title: title,
            description: description,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.activityPackId).toBeTruthy();
        const id = res.body.activityPackId;
        const activityPack = yield (0, activity_pack_test_helpers_1.getActivityPack)(id);
        expect(activityPack.body._id).toEqual(id);
        expect(activityPack.body.title).toEqual(title);
        expect(activityPack.body.description).toEqual(description);
        expect(activityPack.body.activities).toEqual([]);
    }));
    test('POST request to /activity-pack/add-activity adds an activity to the activities array', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = activity_pack_seed_1.testActivityPack1.id;
        const activityId = activity_seed_1.testActivity1.id;
        const res = yield endpoint_tests_setup_1.req.post('/activity-pack/add-activity').send({
            activityPackId: id,
            activityId: activityId,
        });
        expect(res.statusCode).toEqual(200);
        const activityPack = yield (0, activity_pack_test_helpers_1.getActivityPack)(id);
        expect(activityPack.body.activities).toEqual(expect.arrayContaining([activityId]));
    }));
    test('POST request to /activity-pack/remove-activity removes an activity from the activities array', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = activity_pack_seed_1.testActivityPack1.id;
        const activityId = activity_pack_seed_1.testActivityPack1.getActivities[0];
        const res = yield endpoint_tests_setup_1.req.post('/activity-pack/remove-activity').send({
            activityPackId: id,
            activityId: activityId,
        });
        expect(res.statusCode).toEqual(200);
        const activityPack = yield (0, activity_pack_test_helpers_1.getActivityPack)(id);
        expect(activityPack.body.activities).toEqual(expect.not.arrayContaining([activityId]));
    }));
    test('POST request to /activity-pack/remove-all-activities removes all activities from the activities array', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = activity_pack_seed_1.testActivityPack1.id;
        const res = yield endpoint_tests_setup_1.req
            .post('/activity-pack/remove-all-activities')
            .send({
            activityPackId: id,
        });
        expect(res.statusCode).toEqual(200);
        const activityPack = yield (0, activity_pack_test_helpers_1.getActivityPack)(id);
        expect(activityPack.body.activities).toEqual([]);
    }));
});
describe('endpoint tests for ActivityPack routes using PATCH', () => {
    test('PATCH request to /activity-pack updates the title field', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = activity_pack_seed_1.testActivityPack1.id;
        const newTitle = 'NewTitle';
        const res = yield endpoint_tests_setup_1.req.patch('/activity-pack').send({
            activityPackId: id,
            newTitle: newTitle,
        });
        expect(res.statusCode).toEqual(200);
        const activityPack = yield (0, activity_pack_test_helpers_1.getActivityPack)(id);
        expect(activityPack.body.title).toEqual(newTitle);
    }));
    test('PATCH request to /activity-pack updates the description field', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = activity_pack_seed_1.testActivityPack1.id;
        const newDescription = 'NewDescription';
        const res = yield endpoint_tests_setup_1.req.patch('/activity-pack').send({
            activityPackId: id,
            newDescription: newDescription,
        });
        expect(res.statusCode).toEqual(200);
        const activityPack = yield (0, activity_pack_test_helpers_1.getActivityPack)(id);
        expect(activityPack.body.description).toEqual(newDescription);
    }));
});
describe('endpoint tests for ActivityPack routes using DELETE', () => {
    test('DELETE request to /activity-pack deletes an activity pack', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = activity_pack_seed_1.testActivityPack1.id;
        const res = yield endpoint_tests_setup_1.req.delete('/activity-pack').send({
            activityPackId: id,
        });
        expect(res.statusCode).toEqual(200);
        const activityPack = yield (0, activity_pack_test_helpers_1.getActivityPack)(id);
        expect(Object.keys(activityPack.body).length).toEqual(0);
    }));
    test('DELETE request to /activity-pack with an invalid id returns 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = 'InvalidId';
        const res = yield endpoint_tests_setup_1.req.delete('/activity-pack').send({
            activityPackId: id,
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
