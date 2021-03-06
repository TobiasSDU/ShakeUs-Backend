import { getCollection } from '../controllers/endpoint_tests_setup';
import { Activity } from './../../src/models/activity';

export const testActivity1 = new Activity(
    'Activity1Id',
    'Activity1',
    'Activity1Desc',
    Date.now()
);

export const testActivity2 = new Activity(
    'Activity2Id',
    'Activity2',
    'Activity2Desc',
    Date.now() + 1
);

export const seedActivityCollection = async () => {
    const activitiesCollection = await getCollection('activities');

    const activitySeed = [{ ...testActivity1 }, { ...testActivity2 }];

    return await activitiesCollection
        .insertMany(activitySeed)
        .then((result) => {
            return result.acknowledged;
        });
};
