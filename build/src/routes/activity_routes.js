"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityRoutes = void 0;
const express_1 = __importDefault(require("express"));
const activity_controller_1 = require("./../controllers/activity_controller");
exports.activityRoutes = express_1.default.Router();
exports.activityRoutes.post('', activity_controller_1.createActivity);
exports.activityRoutes.get('/:activityId', activity_controller_1.showActivity);
exports.activityRoutes.get('/next/:partyId/:userId', activity_controller_1.nextActivity);
exports.activityRoutes.get('/get-all/:activityPackId', activity_controller_1.getAllActivitiesByActivityPackId);
exports.activityRoutes.patch('', activity_controller_1.updateActivity);
exports.activityRoutes.delete('', activity_controller_1.deleteActivity);
exports.activityRoutes.post('/postpone-all', activity_controller_1.postponeActivities);
exports.activityRoutes.post('/postpone-one', activity_controller_1.postponeActivity);
