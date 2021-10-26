import { Activity } from '../models/activity';
import { ActivityService } from './../services/activity_service';
import { generateUUID } from './../util/uuid_generator';

export const defaultActivities: Activity[] = [
    new Activity(
        'DefaultActivity1',
        'Activity1',
        'Activity1Description',
        Date.now()
    ),
    new Activity(
        'DefaultActivity2',
        'Activity2',
        'Activity2Description',
        Date.now()
    ),
    new Activity(
        'DefaultActivity3',
        'Activity3',
        'Activity3Description',
        Date.now()
    ),
    new Activity(
        'DefaultActivity4',
        'Activity4',
        'Activity4Description',
        Date.now()
    ),
];

export const createActivitiesFromTemplate = async (activityIds: string[]) => {
    const newActivityIds = [];

    for (let i = 0; i < activityIds.length; i++) {
        const activity = getActivityById(activityIds[i]);

        if (activity) {
            activity.id = generateUUID();
            newActivityIds.push(activity.id);

            await ActivityService.createActivity(activity);
        }
    }

    return newActivityIds;
};

const getActivityById = (activityId: string) => {
    for (let i = 0; i < defaultActivities.length; i++) {
        if (defaultActivities[i].id == activityId) {
            return defaultActivities[i];
        }
    }

    return null;
};
