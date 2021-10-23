import { generateUUID } from '../../src/util/uuid_generator';
import { dropDatabase, getCollection, req } from './endpoint_tests_setup';
import { setCurrentDbMode } from '../../config/database_connection';
import { seedPartiesCollection } from './../seed/party.seed';

const partiesCollectionName = 'parties';
const guestsCollectionName = 'guests';

/* describe('endpoint tests for Party routes using GET', () => {
    beforeEach(() => {
        setCurrentDbMode('testFile1');
    });

    it('Hello API Request', async () => {
        const res = await request(app).get('/guest/show').send({
            guestId: 'TestId',
        });

        expect(res.body._name).toEqual('TestUser');
    });

    afterEach(() => {
        //dropDatabase();
    });

    afterAll(() => {
        setCurrentDbMode('prod');
    });
}); */

describe('endpoint tests for Party routes using POST', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile1');
    });

    beforeEach(async () => {
        seedPartiesCollection();
    });

    test('request to /party/create creates a party and a guest/host', async () => {
        const activityPackId = generateUUID();
        const hostName = 'TestHost';

        const res = await req.post('/party/create').send({
            activityPackId: activityPackId,
            hostName: hostName,
        });

        const partyId = res.body.partyId;
        const hostId = res.body.hostId;

        await testParty(partyId, hostId, activityPackId);
        await testHost(hostId, hostName);
    });

    const testParty = async (
        partyId: string,
        hostId: string,
        activityPackId: string
    ) => {
        const party = await (
            await getCollection(partiesCollectionName)
        ).findOne({
            _id: partyId,
        });

        if (party) {
            expect(partyId).toBeTruthy();
            expect(hostId).toBeTruthy();
            expect(party._id).toEqual(partyId);
            expect(party._hosts).toEqual(expect.arrayContaining([hostId]));
            expect(party._primaryHost).toEqual(hostId);
            expect(party._guests).toEqual([]);
            expect(party._activityPackId).toEqual(activityPackId);
        } else {
            throw new Error('party not found');
        }
    };

    const testHost = async (hostId: string, hostName: string) => {
        const host = await (
            await getCollection(guestsCollectionName)
        ).findOne({
            _id: hostId,
        });

        if (host) {
            expect(hostId).toBeTruthy();
            expect(hostName).toBeTruthy();
            expect(host._id).toEqual(hostId);
            expect(host._name).toEqual(hostName);
        } else {
            throw new Error('host not found');
        }
    };

    afterEach(() => {
        dropDatabase();
    });

    afterAll(async () => {
        setCurrentDbMode('prod');
    });
});

/* describe('endpoint tests for Party routes using PATCH', () => {
    beforeEach(() => {
        setCurrentDbMode('testFile1');
    });

    afterAll(() => {
        setCurrentDbMode('prod');
    });
});

describe('endpoint tests for Party routes using DELETE', () => {
    beforeEach(() => {
        setCurrentDbMode('testFile1');
    });

    afterAll(() => {
        setCurrentDbMode('prod');
    });
}); */
