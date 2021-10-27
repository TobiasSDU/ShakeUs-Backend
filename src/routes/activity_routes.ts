import express from 'express';
import {
    createActivity,
    showActivity,
    deleteActivity,
    nextActivity,
    getActivityTemplates,
    updateActivity,
} from './../controllers/activity_controller';

export const activityRoutes = express.Router();

activityRoutes.post('', createActivity);
activityRoutes.get('', showActivity);
activityRoutes.get('/templates', getActivityTemplates);
activityRoutes.get('/next', nextActivity);
activityRoutes.patch('', updateActivity);
activityRoutes.delete('', deleteActivity);
