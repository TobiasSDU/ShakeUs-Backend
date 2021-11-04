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
exports.ActivityPackService = void 0;
const __1 = require("..");
const database_connection_1 = require("../../config/database_connection");
const activity_pack_1 = require("./../models/activity_pack");
const activity_service_1 = require("./activity_service");
const party_service_1 = require("./party_service");
const scheduling_service_1 = require("./scheduling_service");
class ActivityPackService {
    static createActivityPack(activityPack) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivityPacksCollection();
            const insertResult = yield collection.insertOne(Object.assign({}, activityPack));
            return insertResult.acknowledged;
        });
    }
    static showActivityPack(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivityPacksCollection();
            const queryResult = yield collection.findOne({ _id: id });
            if (queryResult) {
                const activityPack = new activity_pack_1.ActivityPack(id, queryResult.title, queryResult.description, queryResult.activities);
                return activityPack;
            }
            else {
                return null;
            }
        });
    }
    static updateActivityPackTitle(id, newTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivityPacksCollection();
            const updateResult = yield collection.updateOne({ _id: id }, { $set: { title: newTitle } });
            if (updateResult.modifiedCount == 1) {
                yield this.emitActivityPackUpdated(id, 'title', newTitle);
                return true;
            }
            return false;
        });
    }
    static updateActivityPackDescription(id, newDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivityPacksCollection();
            const updateResult = yield collection.updateOne({ _id: id }, { $set: { description: newDescription } });
            if (updateResult.modifiedCount == 1) {
                yield this.emitActivityPackUpdated(id, 'description', newDescription);
                return true;
            }
            return false;
        });
    }
    static addActivityPackActivity(id, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivityPacksCollection();
            const newActivity = yield activity_service_1.ActivityService.showActivity(activityId);
            const party = yield party_service_1.PartyService.getPartyByActivityPackId(id);
            const updateResult = yield collection.updateOne({ _id: id }, { $push: { activities: activityId } });
            if (updateResult.modifiedCount == 1 && newActivity) {
                yield (0, scheduling_service_1.rescheduleActivity)(newActivity);
                const socketService = __1.app.get('socketService');
                if (newActivity && party) {
                    socketService.emitToRoom('activity-added', Object.assign(Object.assign({}, newActivity), { message: newActivity.getTitle + ' has been added' }), party._id);
                }
                return true;
            }
            return false;
        });
    }
    static removeActivityPackActivity(id, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivityPacksCollection();
            const removedActivity = yield activity_service_1.ActivityService.showActivity(activityId);
            const party = yield party_service_1.PartyService.getPartyByActivityPackId(id);
            const updateResult = yield collection.updateOne({ _id: id }, { $pull: { activities: activityId } });
            yield activity_service_1.ActivityService.deleteActivity(activityId);
            if (updateResult.modifiedCount == 1) {
                const socketService = __1.app.get('socketService');
                if (removedActivity && party) {
                    socketService.emitToRoom('activity-removed', Object.assign(Object.assign({}, removedActivity), { message: removedActivity.getTitle +
                            ' has been has been removed' }), party._id);
                }
                return true;
            }
            return false;
        });
    }
    static removeAllActivityPackActivities(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivityPacksCollection();
            const party = yield party_service_1.PartyService.getPartyByActivityPackId(id);
            const updateResult = yield collection.updateOne({ _id: id }, { $set: { activities: [] } });
            if (updateResult.modifiedCount == 1) {
                const socketService = __1.app.get('socketService');
                if (party) {
                    socketService.emitToRoom('all-activities-removed', {
                        message: 'All activities have been has been removed',
                    }, party._id);
                }
                return true;
            }
            return false;
        });
    }
    static deleteActivityPack(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivityPacksCollection();
            const activityPack = yield this.showActivityPack(id);
            if (activityPack) {
                const activityPackActivities = activityPack.getActivities;
                const deleteActivitiesResult = yield activity_service_1.ActivityService.deleteActivities(activityPackActivities);
                if (deleteActivitiesResult) {
                    const deleteResult = yield collection.deleteOne({ _id: id });
                    if (deleteResult.deletedCount == 1) {
                        const party = yield this.getPartyId(id);
                        const socketService = __1.app.get('socketService');
                        if (party) {
                            socketService.emitToRoom('activity-pack-deleted', {
                                removedActivityPackId: id,
                                message: 'The activity pack has been deleted',
                            }, party._id);
                        }
                        return true;
                    }
                }
            }
            return false;
        });
    }
    static getActivityPackByActivityId(activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getActivityPacksCollection();
            const queryResult = yield collection.findOne({
                activities: activityId,
            });
            return queryResult;
        });
    }
    static getActivityPacksCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_connection_1.getDatabase)((0, database_connection_1.getDbConnectionString)());
            return db.collection('activity-packs');
        });
    }
    static emitActivityPackUpdated(activityPackId, updatedField, updatedValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const party = yield this.getPartyId(activityPackId);
            const updatedActivityPack = yield this.showActivityPack(activityPackId);
            const socketService = __1.app.get('socketService');
            if (party) {
                socketService.emitToRoom(`activity-pack-${updatedField}-updated`, {
                    updatedActivityPack: Object.assign({}, updatedActivityPack),
                    updatedField: updatedValue,
                    message: 'The activity pack has been updated',
                }, party._id);
            }
        });
    }
    static getPartyId(activityPackId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield party_service_1.PartyService.getPartyByActivityPackId(activityPackId);
        });
    }
}
exports.ActivityPackService = ActivityPackService;
