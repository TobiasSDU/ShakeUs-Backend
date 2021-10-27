import { getCollection } from '../controllers/endpoint_tests_setup';
import { ActivityPack } from './../../src/models/activity_pack';
import { testActivity1, testActivity2 } from './activity.seed';

export const testActivityPack1 = new ActivityPack(
    'ActivityPack1Id',
    'ActivityPack1',
    'ActivityPack1Desc',
    [testActivity1.id]
);

export const testActivityPack2 = new ActivityPack(
    'ActivityPack2Id',
    'ActivityPack2',
    'ActivityPack2Desc',
    [testActivity2.id]
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
