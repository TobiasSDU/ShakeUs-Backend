import express from "express";
import {
  createActivity,
  showActivity,
  deleteActivity,
  nextActivity,
  getActivityTemplates,
  updateActivity,
} from "./../controllers/activity_controller";

export const activityRoutes = express.Router();

activityRoutes.post("", createActivity);
activityRoutes.get("/:activityId", showActivity);
activityRoutes.get("/templates", getActivityTemplates);
activityRoutes.get("/next/:partyId/:userId", nextActivity);
activityRoutes.patch("", updateActivity);
activityRoutes.delete("", deleteActivity);
