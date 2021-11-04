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
exports.deleteActivityPack = exports.removeAllActivityPackActivities = exports.removeActivityPackActivity = exports.addActivityPackActivity = exports.updateActivityPack = exports.getActivityPackTemplates = exports.showActivityPack = exports.createActivityPack = void 0;
const default_activity_packs_1 = require("../templates/default_activity_packs");
const uuid_generator_1 = require("../util/uuid_generator");
const activity_pack_1 = require("./../models/activity_pack");
const activity_pack_service_1 = require("./../services/activity_pack_service");
const createActivityPack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityPackId = (0, uuid_generator_1.generateUUID)();
    const title = req.body.title;
    const description = req.body.description;
    if (title && description) {
        const activityPack = new activity_pack_1.ActivityPack(activityPackId, title, description, []);
        const insertResult = yield activity_pack_service_1.ActivityPackService.createActivityPack(activityPack);
        if (insertResult) {
            return res.json({ activityPackId: activityPackId });
        }
    }
    return res.sendStatus(400);
});
exports.createActivityPack = createActivityPack;
const showActivityPack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityPackId = req.body.activityPackId;
    if (activityPackId) {
        const activityPack = yield activity_pack_service_1.ActivityPackService.showActivityPack(activityPackId);
        if (activityPack) {
            return res.json(activityPack);
        }
    }
    return res.sendStatus(400);
});
exports.showActivityPack = showActivityPack;
const getActivityPackTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (default_activity_packs_1.defaultActivityPacks) {
        return res.json(default_activity_packs_1.defaultActivityPacks);
    }
    return res.sendStatus(404);
});
exports.getActivityPackTemplates = getActivityPackTemplates;
const updateActivityPack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityPackId = req.body.activityPackId;
    const newTitle = req.body.newTitle;
    const newDescription = req.body.newDescription;
    const resultArray = [];
    if (activityPackId) {
        if (newTitle) {
            resultArray.push(yield updateActivityPackTitle(activityPackId, newTitle));
        }
        if (newDescription) {
            resultArray.push(yield updateActivityPackDescription(activityPackId, newDescription));
        }
        if (!resultArray.includes(false)) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.updateActivityPack = updateActivityPack;
const updateActivityPackTitle = (activityPackId, newTitle) => __awaiter(void 0, void 0, void 0, function* () {
    if (activityPackId && newTitle) {
        const updateResult = yield activity_pack_service_1.ActivityPackService.updateActivityPackTitle(activityPackId, newTitle);
        if (updateResult) {
            return true;
        }
    }
    return false;
});
const updateActivityPackDescription = (activityPackId, newDescription) => __awaiter(void 0, void 0, void 0, function* () {
    if (activityPackId && newDescription) {
        const updateResult = yield activity_pack_service_1.ActivityPackService.updateActivityPackDescription(activityPackId, newDescription);
        if (updateResult) {
            return true;
        }
    }
    return false;
});
const addActivityPackActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityPackId = req.body.activityPackId;
    const activityId = req.body.activityId;
    if (activityPackId && activityId) {
        const updateResult = yield activity_pack_service_1.ActivityPackService.addActivityPackActivity(activityPackId, activityId);
        if (updateResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.addActivityPackActivity = addActivityPackActivity;
const removeActivityPackActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityPackId = req.body.activityPackId;
    const activityId = req.body.activityId;
    if (activityPackId && activityId) {
        const updateResult = yield activity_pack_service_1.ActivityPackService.removeActivityPackActivity(activityPackId, activityId);
        if (updateResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.removeActivityPackActivity = removeActivityPackActivity;
const removeAllActivityPackActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityPackId = req.body.activityPackId;
    if (activityPackId) {
        const updateResult = yield activity_pack_service_1.ActivityPackService.removeAllActivityPackActivities(activityPackId);
        if (updateResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.removeAllActivityPackActivities = removeAllActivityPackActivities;
const deleteActivityPack = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityPackId = req.body.activityPackId;
    if (activityPackId) {
        const updateResult = yield activity_pack_service_1.ActivityPackService.deleteActivityPack(activityPackId);
        if (updateResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.deleteActivityPack = deleteActivityPack;
