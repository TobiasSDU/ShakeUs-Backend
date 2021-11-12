import { Guest } from '../../src/models/guest';
import { generateUUID } from '../../src/util/uuid_generator';

const testName = 'TestGuest';
const testToken = 'TestToken';
const originalGuest = new Guest(generateUUID(), testName, testToken);

describe('guest model methods return expected values', () => {
    let testGuest: Guest;

    beforeEach(() => {
        testGuest = Object.assign(
            Object.getPrototypeOf(originalGuest),
            originalGuest
        );
    });

    it('returns a vaild uuid', () => {
        const uuidFormat =
            /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;

        expect(testGuest.id).toMatch(uuidFormat);
    });

    it('returns the correct test name', () => {
        expect(testGuest.getName).toEqual(testName);
    });

    it('return the correct notification token', () => {
        expect(testGuest.getNotificationToken).toEqual(testToken);
    });
});
