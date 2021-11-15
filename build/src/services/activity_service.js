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
exports.ActivityService = void 0;
const __1 = require("..");
const database_connection_1 = require("../../config/database_connection");
const activity_1 = require("./../models/activity");
const activity_pack_service_1 = require("./activity_pack_service");
const party_service_1 = require("./party_service");
const scheduling_service_1 = require("./scheduling_service");
class ActivityService {
    static createActivity(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const insertResult = yield collection.insertOne(Object.assign({}, activity));
            if (insertResult.acknowledged) {
                yield (0, scheduling_service_1.scheduleActivity)(activity);
            }
            return insertResult.acknowledged;
        });
    }
    static createManyActivities(activities) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const documents = [];
            for (let i = 0; i < activities.length; i++) {
                documents.push(Object.assign({}, activities[i]));
            }
            const insertResult = yield collection.insertMany(documents);
            if (insertResult.insertedCount == activities.length) {
                for (let i = 0; i < activities.length; i++) {
                    yield (0, scheduling_service_1.scheduleActivity)(activities[i]);
                }
                return true;
            }
            return false;
        });
    }
    static showActivity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const queryResult = yield collection.findOne({ _id: id });
            if (queryResult) {
                const activity = new activity_1.Activity(id, queryResult.title, queryResult.description, queryResult.startTime);
                return activity;
            }
            else {
                return null;
            }
        });
    }
    static getNextActivity(partyId, userId, currentTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const activityIds = yield this.getPartyActivities(partyId, userId);
            if (activityIds) {
                const activities = collection
                    .find({
                    $and: [
                        { startTime: { $gt: currentTime } },
                        { _id: { $in: activityIds } },
                    ],
                })
                    .sort({ startTime: 1 });
                if (yield activities.hasNext()) {
                    return yield activities.next();
                }
                return null;
            }
            return null;
        });
    }
    static updateActivityTitle(id, newTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const updateResult = yield collection.updateOne({ _id: id }, { $set: { title: newTitle } });
            if (updateResult.modifiedCount == 1) {
                yield this.emitActivityUpdated(id, 'title', newTitle);
                return true;
            }
            return false;
        });
    }
    static updateActivityDescription(id, newDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const updateResult = yield collection.updateOne({ _id: id }, { $set: { description: newDescription } });
            if (updateResult.modifiedCount == 1) {
                yield this.emitActivityUpdated(id, 'description', newDescription);
                return true;
            }
            return false;
        });
    }
    static updateActivityStartTime(id, newStartTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const updateResult = yield collection.updateOne({ _id: id }, { $set: { startTime: newStartTime } });
            if (updateResult.modifiedCount == 1) {
                const activity = yield this.showActivity(id);
                if (activity) {
                    yield (0, scheduling_service_1.rescheduleActivity)(activity);
                }
                yield this.emitActivityUpdated(id, 'start-time', '' + newStartTime);
                return true;
            }
            return false;
        });
    }
    static deleteActivity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const deleteResult = yield collection.deleteOne({ _id: id });
            const party = yield this.getPartyId(id);
            const socketService = __1.app.get('socketService');
            if (party) {
                socketService.emitToRoom('activity-deleted', {
                    removedActivityId: id,
                    message: 'The activity has been deleted',
                }, party._id);
            }
            return deleteResult.deletedCount == 1;
        });
    }
    static deleteActivities(activityIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const deleteResult = yield collection.deleteMany({
                _id: { $in: activityIds },
            });
            return deleteResult.deletedCount == activityIds.length;
        });
    }
    static postponeActivities(partyId, hostId, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const activities = yield this.getPartyActivities(partyId, hostId);
            const collection = yield this.getActivitiesCollection();
            if (activities && party_service_1.PartyService.isUserAHost(partyId, hostId)) {
                for (let i = 0; i < activities.length; i++) {
                    const activity = yield this.showActivity(activities[i]);
                    if (activity) {
                        const newStartTime = activity.getStartTime + time * 1000 * 60;
                        const updateResults = yield collection.updateOne({ _id: activity.id }, { $set: { startTime: newStartTime } });
                        if (updateResults.modifiedCount == activities.length) {
                            const socketService = __1.app.get('socketService');
                            socketService.emitToRoom('all-activities-postponed', {
                                updatedActivites: yield this.getPartyActivities(partyId, hostId),
                                message: 'All activities have been postponed',
                            }, partyId);
                            return true;
                        }
                    }
                }
            }
            return false;
        });
    }
    static postponeActivity(partyId, hostId, activityId, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const activity = yield this.showActivity(activityId);
            if (activity && party_service_1.PartyService.isUserAHost(partyId, hostId)) {
                const newStartTime = activity.getStartTime + time * 1000 * 60;
                const updateResults = yield collection.updateOne({ _id: activity.id }, { $set: { startTime: newStartTime } });
                if (updateResults.modifiedCount == 1) {
                    const socketService = __1.app.get('socketService');
                    socketService.emitToRoom('one-activity-postponed', {
                        updatedActivity: yield this.showActivity(activity.id),
                        message: 'An activity has been postponed',
                    }, partyId);
                    return true;
                }
            }
            return false;
        });
    }
    static getActivitiesCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_connection_1.getDatabase)();
            return db.collection('activities');
        });
    }
    static emitActivityUpdated(activityId, updatedField, updatedValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = yield this.getPartyId(activityId);
            const updatedActivity = yield ActivityService.showActivity(activityId);
            const socketService = __1.app.get('socketService');
            if (party) {
                socketService.emitToRoom(`activity-${updatedField}-updated`, {
                    updatedActivity: Object.assign({}, updatedActivity),
                    updatedField: updatedValue,
                    message: 'The activity has been updated',
                }, party._id);
            }
        });
    }
    static getPartyId(activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const activityPack = yield activity_pack_service_1.ActivityPackService.getActivityPackByActivityId(activityId);
            if (activityPack) {
                return yield party_service_1.PartyService.getPartyByActivityPackId(activityPack._id);
            }
        });
    }
    static getPartyActivities(partyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = yield party_service_1.PartyService.getPartyInfo(partyId, userId);
            if (party) {
                const activityPack = yield activity_pack_service_1.ActivityPackService.showActivityPack(party.getActivityPackId);
                if (activityPack) {
                    return activityPack.getActivities;
                }
            }
            return null;
        });
    }
    static getActivitiesByActivityPackId(activityPackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivitiesCollection();
            const activityPack = yield activity_pack_service_1.ActivityPackService.showActivityPack(activityPackId);
            if (activityPack) {
                const activities = yield collection
                    .find({
                    _id: { $in: activityPack.getActivities },
                })
                    .sort({ startTime: 1 })
                    .toArray();
                return activities;
            }
            return null;
        });
    }
}
exports.ActivityService = ActivityService;
