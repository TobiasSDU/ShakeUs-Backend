import { generateUUID } from '../../src/util/uuid_generator';
import { dropDatabase, req } from './endpoint_tests_setup';
import { setCurrentDbMode } from '../../config/database_connection';
import { seedPartiesCollection, testParty1 } from './../seed/party.seed';
import { testParty } from '../helpers/party_test_helpers';
import { testHostOrGuest } from '../helpers/guest_test_helpers';

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
        await seedPartiesCollection();
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

        await testParty(partyId, [hostId], hostId, [], activityPackId);
        await testHostOrGuest(hostId, hostName);
    });

    afterEach(() => {
        dropDatabase();
    });

    afterAll(async () => {
        setCurrentDbMode('prod');
    });
});

describe('endpoint tests for Party routes using PATCH', () => {
    beforeAll(() => {
        setCurrentDbMode('testFile1');
    });

    beforeEach(async () => {
        await seedPartiesCollection();
    });

    test('request to /party/create creates a party and a guest/host', async () => {
        const partyId = testParty1.id;
        const primaryHostId = testParty1.primaryHost;
        const newActivityPackId = generateUUID();

        const res = await req.patch('/party/activity-pack/update').send({
            partyId: partyId,
            primaryHostId: primaryHostId,
            newActivityPackId: newActivityPackId,
        });

        expect(res.statusCode).toEqual(200);

        const party = await req.get('/party/show').send({
            partyId: partyId,
            guestId: primaryHostId,
        });

        expect(party.body._activityPackId).toEqual(newActivityPackId);
    });

    afterEach(() => {
        dropDatabase();
    });

    afterAll(async () => {
        setCurrentDbMode('prod');
    });
});

/*
describe('endpoint tests for Party routes using DELETE', () => {
    beforeEach(() => {
        setCurrentDbMode('testFile1');
    });

    afterAll(() => {
        setCurrentDbMode('prod');
    });
}); */
