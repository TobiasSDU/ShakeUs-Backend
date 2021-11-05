import express from 'express';
import {
    createActivity,
    showActivity,
    deleteActivity,
    nextActivity,
    getActivityTemplates,
    updateActivity,
    postponeActivities,
    postponeActivity,
} from './../controllers/activity_controller';

export const activityRoutes = express.Router();

activityRoutes.post('', createActivity);
activityRoutes.get('/:activityId', showActivity);
activityRoutes.get('/templates', getActivityTemplates);
activityRoutes.get('/next/:partyId/:userId', nextActivity);
activityRoutes.patch('', updateActivity);
activityRoutes.delete('', deleteActivity);
activityRoutes.post('/postpone-all', postponeActivities);
activityRoutes.post('/postpone-one', postponeActivity);
