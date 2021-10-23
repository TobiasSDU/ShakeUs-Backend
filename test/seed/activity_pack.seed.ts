import { getCollection } from '../controllers/endpoint_tests_setup';
import { ActivityPack } from './../../src/models/activity_pack';

export const seedActivityPackCollection = async () => {
    const activityPackCollection = await getCollection('activity-packs');

    const testActivityPack1 = new ActivityPack(
        'ActivityPack1',
        'ActivityPack1Desc',
        []
    );
    const testActivityPack2 = new ActivityPack(
        'ActivityPack2',
        'ActivityPack2Desc',
        []
    );

    const activityPackSeed = [testActivityPack1, testActivityPack2];

    activityPackSeed.forEach(async (seed) => {
        activityPackCollection.insertOne({ ...seed });
    });
};
