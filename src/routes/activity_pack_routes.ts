import express from 'express';
import {
    addActivityPackActivity,
    createActivityPack,
    deleteActivityPack,
    removeActivityPackActivity,
    removeAllActivityPackActivities,
    showActivityPack,
    updateActivityPackDescription,
    updateActivityPackTitle,
} from '../controllers/activity_pack_controller';

export const activityPackRoutes = express.Router();

activityPackRoutes.post('/create', createActivityPack);
activityPackRoutes.get('/show', showActivityPack);
activityPackRoutes.patch('/title/update', updateActivityPackTitle);
activityPackRoutes.patch('/description/update', updateActivityPackDescription);
activityPackRoutes.patch('/activities/add', addActivityPackActivity);
activityPackRoutes.patch('/activities/remove', removeActivityPackActivity);
activityPackRoutes.patch(
    '/activities/remove-all',
    removeAllActivityPackActivities
);
activityPackRoutes.delete('/delete', deleteActivityPack);
