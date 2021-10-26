import { ActivityPack } from '../models/activity_pack';
import {
    createActivitiesFromTemplate,
    defaultActivities,
} from './default_activities';
import { ActivityPackService } from './../services/activity_pack_service';
import { generateUUID } from './../util/uuid_generator';

const defaultActivityPack = new ActivityPack(
    'DefaultActivityPack1',
    'ActivityPack1',
    'ActivityPack1Description',
    [
        defaultActivities[0].id,
        defaultActivities[1].id,
        defaultActivities[2].id,
        defaultActivities[3].id,
    ]
);

export const defaultActivityPacks: ActivityPack[] = [defaultActivityPack];

export const createActivityPackFromTemplate = async (
    activityPackId: string
) => {
    const activityPack = getActivityPackById(activityPackId);

    if (activityPack) {
        activityPack.id = generateUUID();

        const newActivityIds = await createActivitiesFromTemplate(
            activityPack.getActivities
        );
        updateActivityIds(activityPack, newActivityIds);

        await ActivityPackService.createActivityPack(activityPack);

        return activityPack.id;
    }

    return '';
};

const getActivityPackById = (activityPackId: string) => {
    for (let i = 0; i < defaultActivityPacks.length; i++) {
        if (defaultActivityPacks[i].id == activityPackId) {
            return defaultActivityPacks[i];
        }
    }

    return null;
};

const updateActivityIds = (
    activityPack: ActivityPack,
    newActivityIds: string[]
) => {
    activityPack.setActivities = [];
    for (let i = 0; i < newActivityIds.length; i++) {
        activityPack.addActivity(newActivityIds[i]);
    }
};
