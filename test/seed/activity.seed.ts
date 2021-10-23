import { getCollection } from '../controllers/endpoint_tests_setup';
import { Activity } from './../../src/models/activity';

export const seedActivityCollection = async () => {
    const activitiesCollection = await getCollection('activities');

    const testActivity1 = new Activity(
        'Activity1',
        'Activity1Desc',
        Date.now()
    );
    const testActivity2 = new Activity(
        'Activity1',
        'Activity1Desc',
        Date.now() + 1
    );

    const activitySeed = [testActivity1, testActivity2];

    activitySeed.forEach(async (seed) => {
        activitiesCollection.insertOne({ ...seed });
    });
};
