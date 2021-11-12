import { Guest } from '../../src/models/guest';
import { getCollection } from '../controllers/endpoint_tests_setup';

export const testGuest1 = new Guest(
    'TestGuest1',
    'TestGuest1Name',
    'TestToken1'
);
export const testGuest2 = new Guest(
    'TestGuest2',
    'TestGuest2Name',
    'TestToken2'
);
export const testGuest3 = new Guest(
    'TestGuest3',
    'TestGuest3Name',
    'TestToken3'
);

export const seedGuestsCollection = async () => {
    const guestsCollection = await getCollection('guests');

    const guestSeed = [{ ...testGuest1 }, { ...testGuest2 }, { ...testGuest3 }];

    return await guestsCollection.insertMany(guestSeed).then((result) => {
        return result.acknowledged;
    });
};
