import { Party } from '../../src/models/party';
import { getCollection } from '../controllers/endpoint_tests_setup';

export const seedPartiesCollection = async () => {
    const partiesCollection = await getCollection('parties');

    const testParty1 = new Party(
        'TestParty1',
        ['TestHost1'],
        'TestHost1',
        ['TestGuest1'],
        'TestPack1'
    );

    const testParty2 = new Party(
        'TestParty2',
        ['TestHost1', 'TestHost2'],
        'TestHost2',
        ['TestGuest1', 'TestGuest2', 'TestGuest3'],
        'TestPack2'
    );

    const partySeed = [testParty1, testParty2];

    partySeed.forEach(async (seed) => {
        partiesCollection.insertOne({ ...seed });
    });
};
