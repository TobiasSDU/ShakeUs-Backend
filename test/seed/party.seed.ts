import { Collection } from 'mongodb';
import { Party } from '../../src/models/party';
import { generatePartyId } from '../../src/util/party_id_generator';
import { getCollection } from '../controllers/endpoint_tests_setup';
import { testActivityPack1, testActivityPack2 } from './activity_pack.seed';
import { testGuest1, testGuest2 } from './guest.seed';

export const testParty1 = new Party(
    generatePartyId(),
    [testGuest2.id],
    testGuest2.id,
    [testGuest1.id],
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
