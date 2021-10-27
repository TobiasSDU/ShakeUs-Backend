import express from 'express';
import {
    addActivityPackActivity,
    createActivityPack,
    deleteActivityPack,
    getActivityPackTemplates,
    removeActivityPackActivity,
    removeAllActivityPackActivities,
    showActivityPack,
    updateActivityPack,
} from '../controllers/activity_pack_controller';

export const activityPackRoutes = express.Router();

activityPackRoutes.post('', createActivityPack);
activityPackRoutes.get('', showActivityPack);
activityPackRoutes.get('/templates', getActivityPackTemplates);
activityPackRoutes.patch('', updateActivityPack);
activityPackRoutes.post('/add-activity', addActivityPackActivity);
activityPackRoutes.post('/remove-activity', removeActivityPackActivity);
activityPackRoutes.post(
    '/remove-all-activities',
    removeAllActivityPackActivities
);
activityPackRoutes.delete('', deleteActivityPack);
