import { Party } from '../../src/models/party';
import { generateUUID } from '../../src/util/uuid_generator';
import { ActivityPack } from '../../src/models/activity_pack';
import { testActivityPack2 } from '../seed/activity_pack.seed';

const hostId = generateUUID();

const activityPack: ActivityPack = new ActivityPack(
    'TestId',
    'TestPack',
    'TestDescription',
    []
);

const originalParty: Party = new Party(
    generateUUID(),
    [hostId],
    hostId,
    [],
    activityPack.id
);

describe('party model methods return expected values', () => {
    let testParty: Party;

    beforeEach(() => {
        testParty = Object.assign(
            Object.getPrototypeOf(originalParty),
            originalParty
        );
    });

    it('returns a string id', () => {
        expect(typeof testParty.id).toBe('string');
    });

    it('returns an array of hosts', () => {
        expect(Array.isArray(testParty.getHosts)).toBe(true);
    });

    it('contains the host id in the hosts-array', () => {
        expect(testParty.getHosts).toEqual(expect.arrayContaining([hostId]));
    });

    test('the length of the hosts-array is 1 when a party is created', () => {
        expect(testParty.getHosts.length).toEqual(1);
    });

    it('should set the the hosts-array to the specified array', () => {
        const testArray = ['host1', 'host2'];

        testParty.setHosts = testArray;
        expect(testParty.getHosts).toEqual(testArray);
    });

    it('is possible to add a hostId to the hosts-array', () => {
        testParty.addHost('new-host');
        expect(testParty.getHosts).toEqual(
            expect.arrayContaining(['new-host'])
        );
    });

    it('removes a host from the host-array', () => {
        const testArray = ['host1', 'host2'];

        testParty.setHosts = testArray;
        testParty.removeHost('host1');

        expect(testParty.getHosts).toEqual(['host2']);
    });

    test('primary host is set to the first element of the hosts-array when a party is created', () => {
        const firstHost: string = testParty.getHosts[0];

        expect(testParty.getPrimaryHost).toEqual(firstHost);
    });

    test('primary host is a uuid', () => {
        const uuidFormat =
            /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;

        expect(testParty.getPrimaryHost).toMatch(uuidFormat);
    });

    test('the value of primary host can be changed', () => {
        const testString = 'new-host';
        testParty.setPrimaryHost = testString;
        expect(testParty.getPrimaryHost).toEqual(testString);
    });

    test('the list of guests is initially empty', () => {
        expect(testParty.getGuests.length).toBe(0);
    });

    test('a list of guest ids can be set and retreived', () => {
        const testGuests = ['guest1', 'guest2', 'guest3'];
        testParty.setGuests = testGuests;

        expect(testParty.getGuests).toEqual(testGuests);
    });

    test('a guest id can be added to the guests-array', () => {
        const testGuests = ['guest1', 'guest2', 'guest3'];
        testParty.setGuests = testGuests;

        testParty.addGuest('guest4');

        expect(testParty.getGuests).toEqual(expect.arrayContaining(['guest4']));
    });

    test('multipe guest ids can be added to the guests-array', () => {
        const testGuests = ['guest1', 'guest2', 'guest3'];
        testParty.setGuests = testGuests;

        testParty.addGuests(['guest4', 'guest5', 'guest6']);

        expect(testParty.getGuests).toEqual(
            expect.arrayContaining(['guest4', 'guest5', 'guest6'])
        );
    });

    it('removes the specified guest from the guests-array', () => {
        const testGuests = ['guest1', 'guest2', 'guest3'];
        testParty.setGuests = testGuests;

        testParty.removeGuest('guest3');

        expect(testParty.getGuests).toEqual(
            expect.not.arrayContaining(['guest3'])
        );
    });

    it('removes all guests', () => {
        const testGuests = ['guest1', 'guest2', 'guest3'];
        testParty.setGuests = testGuests;

        testParty.removeAllGuests();

        expect(testParty.getGuests).toEqual([]);
    });

    it('has an activity pack', () => {
        expect(testParty.getActivityPackId).toEqual(activityPack.id);
    });

    test('the activity pack can be changed', () => {
        const newActivityPack: ActivityPack = testActivityPack2;

        testParty.setActivityPackId = newActivityPack.id;
        expect(testParty.getActivityPackId).toEqual(newActivityPack.id);
    });
});
