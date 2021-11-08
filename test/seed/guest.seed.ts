import { Guest } from '../../src/models/guest';
import { getCollection } from '../controllers/endpoint_tests_setup';

export const testGuest1 = new Guest('TestGuest1', 'TestGuest1Name');
export const testGuest2 = new Guest('TestGuest2', 'TestGuest2Name');
export const testGuest3 = new Guest('TestGuest3', 'TestGuest3Name');

export const seedGuestsCollection = async () => {
    const guestsCollection = await getCollection('guests');

    const guestSeed = [{ ...testGuest1 }, { ...testGuest2 }, { ...testGuest3 }];

    return await guestsCollection.insertMany(guestSeed).then((result) => {
        return result.acknowledged;
    });
};
