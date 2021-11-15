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
const activity_pack_service_1 = require("./../services/activity_pack_service");
const uuid_generator_1 = require("./../util/uuid_generator");
const default_activities_1 = require("./default_activities");
const defaultActivityPack1 = new activity_pack_1.ActivityPack("AP1", "The Classics", "Fun party games and activities everyone should know.", ["AP1A1", "AP1A2", "AP1A3", "AP1A4", "AP1A5", "AP1A6"]);
const defaultActivityPack2 = new activity_pack_1.ActivityPack("AP2", "Standard Activities", "Easy activities for everyone.", ["AP2A1", "AP2A2", "AP2A3", "AP2A4", "AP2A5", "AP2A6"]);
const defaultActivityPack3 = new activity_pack_1.ActivityPack("AP3", "Liver Damage", "An activity pack filled with fun drinking games.", ["AP3A1", "AP3A2", "AP3A3", "AP3A4"]);
exports.defaultActivityPacks = [
    defaultActivityPack1,
    defaultActivityPack2,
    defaultActivityPack3,
];
const createActivityPackFromTemplate = (activityPackId) => __awaiter(void 0, void 0, void 0, function* () {
    const activityPack = getActivityPackById(activityPackId);
    if (activityPack) {
        activityPack.id = (0, uuid_generator_1.generateUUID)();
        const newActivityIds = yield (0, default_activities_1.createActivitiesFromTemplate)(activityPack.getActivities);
        updateActivityIds(activityPack, newActivityIds);
        yield activity_pack_service_1.ActivityPackService.createActivityPack(activityPack);
        return activityPack.id;
    }
    return "";
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
