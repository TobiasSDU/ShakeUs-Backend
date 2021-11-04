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
exports.createActivityPackFromTemplate = exports.defaultActivityPacks = void 0;
const activity_pack_1 = require("../models/activity_pack");
const default_activities_1 = require("./default_activities");
const activity_pack_service_1 = require("./../services/activity_pack_service");
const uuid_generator_1 = require("./../util/uuid_generator");
const defaultActivityPack = new activity_pack_1.ActivityPack('DefaultActivityPack1', 'ActivityPack1', 'ActivityPack1Description', [
    default_activities_1.defaultActivities[0].id,
    default_activities_1.defaultActivities[1].id,
    default_activities_1.defaultActivities[2].id,
    default_activities_1.defaultActivities[3].id,
]);
exports.defaultActivityPacks = [defaultActivityPack];
const createActivityPackFromTemplate = (activityPackId) => __awaiter(void 0, void 0, void 0, function* () {
    const activityPack = getActivityPackById(activityPackId);
    if (activityPack) {
        activityPack.id = (0, uuid_generator_1.generateUUID)();
        const newActivityIds = yield (0, default_activities_1.createActivitiesFromTemplate)(activityPack.getActivities);
        updateActivityIds(activityPack, newActivityIds);
        yield activity_pack_service_1.ActivityPackService.createActivityPack(activityPack);
        return activityPack.id;
    }
    return '';
});
exports.createActivityPackFromTemplate = createActivityPackFromTemplate;
const getActivityPackById = (activityPackId) => {
    for (let i = 0; i < exports.defaultActivityPacks.length; i++) {
        if (exports.defaultActivityPacks[i].id == activityPackId) {
            return Object.assign(Object.getPrototypeOf(exports.defaultActivityPacks[i]), exports.defaultActivityPacks[i]);
        }
    }
    return null;
};
const updateActivityIds = (activityPack, newActivityIds) => {
    activityPack.setActivities = [];
    for (let i = 0; i < newActivityIds.length; i++) {
        activityPack.addActivity(newActivityIds[i]);
    }
};
