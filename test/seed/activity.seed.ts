import { getCollection } from '../controllers/endpoint_tests_setup';
import { Activity } from './../../src/models/activity';

export const testActivity1 = new Activity(
    'Activity1',
    'Activity1Desc',
    Date.now()
);

export const testActivity2 = new Activity(
    'Activity1',
    'Activity1Desc',
    Date.now() + 1
);

export const seedActivityCollection = async () => {
    const activitiesCollection = await getCollection('activities');

    const activitySeed = [testActivity1, testActivity2];

    activitySeed.forEach(async (seed) => {
        activitiesCollection.insertOne({ ...seed });
    });
};
