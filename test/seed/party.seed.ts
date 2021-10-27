import { Collection } from 'mongodb';
import { Party } from '../../src/models/party';
import { generatePartyId } from '../../src/util/party_id_generator';
import { getCollection } from '../controllers/endpoint_tests_setup';
import { testActivityPack1, testActivityPack2 } from './activity_pack.seed';

export const testParty1 = new Party(
    generatePartyId(),
    ['TestHost1'],
    'TestHost1',
    ['TestGuest1'],
    testActivityPack1.id
);

export const testParty2 = new Party(
    generatePartyId(),
    ['TestHost2', 'TestHost3'],
    'TestHost2',
    ['TestGuest2', 'TestGuest3'],
    testActivityPack2.id
);

export const seedPartiesCollection = async () => {
    const partiesCollection: Collection = await getCollection('parties');

    const partySeed = [{ ...testParty1 }, { ...testParty2 }];

    return await partiesCollection.insertMany(partySeed).then((result) => {
        return result.acknowledged;
    });
};
