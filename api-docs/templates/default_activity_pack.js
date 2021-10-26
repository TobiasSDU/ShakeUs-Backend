import { defaultActivities } from './default_activities.js';

export const defaultActivityPack = {
    _id: 'DefaultActivityPack1',
    title: 'ActivityPack1',
    description: 'ActivityPack1Description',
    activities: [
        defaultActivities[0]._id,
        defaultActivities[1]._id,
        defaultActivities[2]._id,
        defaultActivities[3]._id,
    ],
};
