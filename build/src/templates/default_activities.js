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
exports.createActivitiesFromTemplate = exports.defaultActivities = void 0;
const activity_1 = require("../models/activity");
const activity_service_1 = require("./../services/activity_service");
const uuid_generator_1 = require("./../util/uuid_generator");
exports.defaultActivities = [
    new activity_1.Activity('DefaultActivity1', 'Activity1', 'Activity1Description', Date.now()),
    new activity_1.Activity('DefaultActivity2', 'Activity2', 'Activity2Description', Date.now()),
    new activity_1.Activity('DefaultActivity3', 'Activity3', 'Activity3Description', Date.now()),
    new activity_1.Activity('DefaultActivity4', 'Activity4', 'Activity4Description', Date.now()),
];
const createActivitiesFromTemplate = (activityIds) => __awaiter(void 0, void 0, void 0, function* () {
    const newActivityIds = [];
    const newActivities = [];
    for (let i = 0; i < activityIds.length; i++) {
        const activity = getActivityById(activityIds[i]);
        if (activity) {
            activity.id = (0, uuid_generator_1.generateUUID)();
            newActivityIds.push(activity.id);
            newActivities.push(new activity_1.Activity(activity.id, activity.getTitle, activity.getDescription, Date.now() + 60000 * 60));
        }
    }
    yield activity_service_1.ActivityService.createManyActivities(newActivities);
    return newActivityIds;
});
exports.createActivitiesFromTemplate = createActivitiesFromTemplate;
const getActivityById = (activityId) => {
    for (let i = 0; i < exports.defaultActivities.length; i++) {
        if (exports.defaultActivities[i].id == activityId) {
            return Object.assign(Object.getPrototypeOf(exports.defaultActivities[i]), exports.defaultActivities[i]);
        }
    }
    return null;
};
