import { ActivityPack } from '../models/activity_pack';
import { defaultActivities } from './default_activities';

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
