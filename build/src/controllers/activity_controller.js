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
exports.postponeActivity = exports.postponeActivities = exports.deleteActivity = exports.updateActivity = exports.getAllActivitiesByActivityPackId = exports.nextActivity = exports.showActivity = exports.createActivity = void 0;
const uuid_generator_1 = require("../util/uuid_generator");
const activity_1 = require("./../models/activity");
const activity_service_1 = require("./../services/activity_service");
const createActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, uuid_generator_1.generateUUID)();
    const title = req.body.title;
    const description = req.body.description;
    const startTime = req.body.startTime;
    if (id && title && description && startTime) {
        const activity = new activity_1.Activity(id, title, description, startTime);
        const insertResult = yield activity_service_1.ActivityService.createActivity(activity);
        if (insertResult) {
            return res.json({ activityId: activity.id });
        }
    }
    return res.sendStatus(400);
});
exports.createActivity = createActivity;
const showActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.activityId;
    if (id) {
        const activity = yield activity_service_1.ActivityService.showActivity(id);
        if (activity) {
            return res.json(activity);
        }
    }
    return res.sendStatus(400);
});
exports.showActivity = showActivity;
const nextActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.params.partyId;
    const userId = req.params.userId;
    const currentTime = Date.now();
    if (partyId && userId) {
        const activity = yield activity_service_1.ActivityService.getNextActivity(partyId, userId, currentTime);
        if (activity) {
            return res.json(activity);
        }
    }
    return res.sendStatus(400);
});
exports.nextActivity = nextActivity;
const getAllActivitiesByActivityPackId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityPackId = req.params.activityPackId;
    if (activityPackId) {
        const activities = yield activity_service_1.ActivityService.getActivitiesByActivityPackId(activityPackId);
        if (activities) {
            return res.json(activities);
        }
    }
    return res.sendStatus(400);
});
exports.getAllActivitiesByActivityPackId = getAllActivitiesByActivityPackId;
const updateActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.activityId;
    const newTitle = req.body.newTitle;
    const newDescription = req.body.newDescription;
    const newStartTime = req.body.newStartTime;
    const resultArray = [];
    if (id) {
        if (newTitle) {
            resultArray.push(yield updateActivityTitle(id, newTitle));
        }
        if (newDescription) {
            resultArray.push(yield updateActivityDescription(id, newDescription));
        }
        if (newStartTime) {
            resultArray.push(yield updateActivityStartTime(id, newStartTime));
        }
        if (!resultArray.includes(false)) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.updateActivity = updateActivity;
const updateActivityTitle = (id, newTitle) => __awaiter(void 0, void 0, void 0, function* () {
    if (id && newTitle) {
        const updateResult = yield activity_service_1.ActivityService.updateActivityTitle(id, newTitle);
        if (updateResult) {
            return true;
        }
    }
    return false;
});
const updateActivityDescription = (id, newDescription) => __awaiter(void 0, void 0, void 0, function* () {
    if (id && newDescription) {
        const updateResult = yield activity_service_1.ActivityService.updateActivityDescription(id, newDescription);
        if (updateResult) {
            return true;
        }
    }
    return false;
});
const updateActivityStartTime = (id, newStartTime) => __awaiter(void 0, void 0, void 0, function* () {
    if (id && newStartTime) {
        const updateResult = yield activity_service_1.ActivityService.updateActivityStartTime(id, newStartTime);
        if (updateResult) {
            return true;
        }
    }
    return false;
});
const deleteActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.activityId;
    if (id) {
        const deleteResult = yield activity_service_1.ActivityService.deleteActivity(id);
        if (deleteResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.deleteActivity = deleteActivity;
const postponeActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.body.partyId;
    const hostId = req.body.hostId;
    const delay = req.body.delay;
    if (partyId && hostId && delay) {
        const updateResult = yield activity_service_1.ActivityService.postponeActivities(partyId, hostId, delay);
        if (updateResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.postponeActivities = postponeActivities;
const postponeActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.body.partyId;
    const hostId = req.body.hostId;
    const activityId = req.body.activityId;
    const delay = req.body.delay;
    if (partyId && hostId && activityId && delay) {
        const updateResult = yield activity_service_1.ActivityService.postponeActivity(partyId, hostId, activityId, delay);
        if (updateResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.postponeActivity = postponeActivity;
