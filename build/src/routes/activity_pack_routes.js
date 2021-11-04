"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityPackRoutes = void 0;
const express_1 = __importDefault(require("express"));
const activity_pack_controller_1 = require("../controllers/activity_pack_controller");
exports.activityPackRoutes = express_1.default.Router();
exports.activityPackRoutes.post("", activity_pack_controller_1.createActivityPack);
exports.activityPackRoutes.get("/:", activity_pack_controller_1.showActivityPack);
exports.activityPackRoutes.get("/templates", activity_pack_controller_1.getActivityPackTemplates);
exports.activityPackRoutes.patch("", activity_pack_controller_1.updateActivityPack);
exports.activityPackRoutes.post("/add-activity", activity_pack_controller_1.addActivityPackActivity);
exports.activityPackRoutes.post("/remove-activity", activity_pack_controller_1.removeActivityPackActivity);
exports.activityPackRoutes.post("/remove-all-activities", activity_pack_controller_1.removeAllActivityPackActivities);
exports.activityPackRoutes.delete("", activity_pack_controller_1.deleteActivityPack);
