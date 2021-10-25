import { Collection } from 'mongodb';
import { Party } from '../../src/models/party';
import { generatePartyId } from '../../src/util/party_id_generator';
import { getCollection } from '../controllers/endpoint_tests_setup';

export const testParty1 = new Party(
    generatePartyId(),
    ['TestHost1'],
    'TestHost1',
    ['TestGuest1'],
    'TestPack1'
);

export const testParty2 = new Party(
    generatePartyId(),
    ['TestHost2', 'TestHost3'],
    'TestHost2',
    ['TestGuest2', 'TestGuest3'],
    'TestPack2'
);

export const seedPartiesCollection = async () => {
    const partiesCollection: Collection = await getCollection('parties');

    const partySeed = [{ ...testParty1 }, { ...testParty2 }];

    return await partiesCollection.insertMany(partySeed).then((result) => {
        return result.acknowledged;
    });
};
