import { getCollection } from '../controllers/endpoint_tests_setup';
import { ActivityPack } from './../../src/models/activity_pack';

export const testActivityPack1 = new ActivityPack(
    'ActivityPack1',
    'ActivityPack1Desc',
    []
);

export const testActivityPack2 = new ActivityPack(
    'ActivityPack2',
    'ActivityPack2Desc',
    []
);

export const seedActivityPackCollection = async () => {
    const activityPackCollection = await getCollection('activity-packs');

    const activityPackSeed = [
        { ...testActivityPack1 },
        { ...testActivityPack2 },
    ];

    return await activityPackCollection
        .insertMany(activityPackSeed)
        .then((result) => {
            return result.acknowledged;
        });
};
