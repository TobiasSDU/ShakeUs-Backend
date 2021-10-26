import express from 'express';
import {
    createActivity,
    showActivity,
    updateActivityTitle,
    updateActivityDescription,
    updateActivityStartTime,
    deleteActivity,
    nextActivity,
} from './../controllers/activity_controller';

export const activityRoutes = express.Router();

activityRoutes.post('/create', createActivity);
activityRoutes.get('/show', showActivity);
activityRoutes.get('/next', nextActivity);
activityRoutes.patch('/title/update', updateActivityTitle);
activityRoutes.patch('/description/update', updateActivityDescription);
activityRoutes.patch('/start-time/update', updateActivityStartTime);
activityRoutes.delete('/delete', deleteActivity);
