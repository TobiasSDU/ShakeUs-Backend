import { Party } from '../../models/Party';
import { generateUUID } from '../../util/uuid_generator';
import { IActivityPack } from './../../models/IActivityPack';

const hostId = generateUUID();
const activityPackId = generateUUID();

const activityPack: IActivityPack = {
    id: activityPackId,
    title: 'TestPack',
    description: 'TestDescription',
    activities: [],
};

const originalParty: Party = new Party(hostId, activityPack);

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
        expect(Array.isArray(testParty.hosts)).toBe(true);
    });

    it('contains the host id in the hosts-array', () => {
        expect(testParty.hosts).toEqual(expect.arrayContaining([hostId]));
    });

    test('the length of the hosts-array is 1 when a party is created', () => {
        expect(testParty.hosts.length).toEqual(1);
    });

    it('should set the the hosts-array to the specified array', () => {
        const testArray = ['host1', 'host2'];

        testParty.hosts = testArray;
        expect(testParty.hosts).toEqual(testArray);
    });

    it('is possible to add a hostId to the hosts-array', () => {
        testParty.addHost('new-host');
        expect(testParty.hosts).toEqual(expect.arrayContaining(['new-host']));
    });

    it('removes a host from the host-array', () => {
        const testArray = ['host1', 'host2'];

        testParty.hosts = testArray;
        testParty.removeHost('host1');

        expect(testParty.hosts).toEqual(['host2']);
    });

    test('primary host is set to the first element of the hosts-array when a party is created', () => {
        const firstHost: string = testParty.hosts[0];

        expect(testParty.primaryHost).toEqual(firstHost);
    });

    test('primary host is a uuid', () => {
        const uuidFormat =
            /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;

        expect(testParty.primaryHost).toMatch(uuidFormat);
    });

    test('the value of primary host can be changed', () => {
        const testString = 'new-host';
        testParty.primaryHost = testString;
        expect(testParty.primaryHost).toEqual(testString);
    });

    it('has an activity pack', () => {
        expect(testParty.activityPack).toEqual(activityPack);
    });

    test('the activity pack can be changed', () => {
        const newActivityPack: IActivityPack = {
            id: 'randomId',
            title: 'TestPack2',
            description: 'TestDescription2',
            activities: [],
        };

        testParty.activityPack = newActivityPack;
        expect(testParty.activityPack).toEqual(newActivityPack);
    });
});
