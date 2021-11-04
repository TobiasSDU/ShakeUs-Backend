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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_connection_1 = require("../../config/database_connection");
const src_1 = require("../../src");
const socket_service_1 = require("../../src/services/socket_service");
const activity_test_helpers_1 = require("../helpers/activity_test_helpers");
const activity_seed_1 = require("../seed/activity.seed");
const endpoint_tests_setup_1 = require("./endpoint_tests_setup");
const http_1 = __importDefault(require("http"));
let server;
beforeAll(() => {
    server = http_1.default.createServer(src_1.app);
    (0, database_connection_1.setCurrentDbMode)('testFile4');
    src_1.app.set('socketService', new socket_service_1.SocketService(server));
});
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, activity_seed_1.seedActivityCollection)();
}));
describe('endpoint tests for Activity routes using GET', () => {
    test('GET request to /activity returns an activity', () => __awaiter(void 0, void 0, void 0, function* () {
        const activityId = activity_seed_1.testActivity1.id;
        const res = yield endpoint_tests_setup_1.req.get('/activity').send({
            activityId: activityId,
        });
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
    test('GET request to /activity with an invalid id returns 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const activityId = 'invalidId';
        const res = yield endpoint_tests_setup_1.req.get('/activity').send({
            activityId: activityId,
        });
        expect(res.statusCode).toEqual(400);
        expect(Object.keys(res.body).length).toEqual(0);
    }));
});
describe('endpoint tests for Activity routes using POST', () => {
    test('POST request to /activity returns an activity', () => __awaiter(void 0, void 0, void 0, function* () {
        const title = 'TestTitle';
        const description = 'TestDescription';
        const startTime = 1635082733652;
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
    server.close();
});
