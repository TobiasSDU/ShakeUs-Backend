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
exports.rescheduleActivity = exports.scheduleActivity = void 0;
const node_schedule_1 = __importDefault(require("node-schedule"));
const __1 = require("..");
const activity_pack_service_1 = require("./activity_pack_service");
const party_service_1 = require("./party_service");
const jobs = {};
const scheduleActivity = (activity) => __awaiter(void 0, void 0, void 0, function* () {
    const activityId = activity.id;
    const executionTime = new Date(activity.getStartTime);
    const socketService = __1.app.get('socketService');
    const activityPack = yield activity_pack_service_1.ActivityPackService.getActivityPackByActivityId(activityId);
    if (activityPack) {
        const party = yield party_service_1.PartyService.getPartyByActivityPackId(activityPack._id);
        if (party) {
            console.log('Scheduler reached');
            jobs[activityId] = node_schedule_1.default.scheduleJob(executionTime, function () {
                socketService.emitToRoom('activity-started', {
                    activity: Object.assign({}, activity),
                    message: 'An activity has started!',
                }, party._id);
            });
        }
    }
});
exports.scheduleActivity = scheduleActivity;
const rescheduleActivity = (activity) => __awaiter(void 0, void 0, void 0, function* () {
    const activityId = activity.id;
    if (jobs[activityId]) {
        jobs[activityId].cancel(false);
        delete jobs[activityId];
    }
    yield (0, exports.scheduleActivity)(activity);
});
exports.rescheduleActivity = rescheduleActivity;
