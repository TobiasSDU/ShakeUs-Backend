import { Activity } from '../../src/models/activity';
import { generateUUID } from '../../src/util/uuid_generator';

const testId = generateUUID();
const testTitle = 'TestActivity';
const testDescription = 'TestActivityDescription';
const originalActivity = new Activity(
    testId,
    testTitle,
    testDescription,
    Date.now()
);

describe('activity model methods return expected values', () => {
    let testActivity: Activity;

    beforeEach(() => {
        testActivity = Object.assign(
            Object.getPrototypeOf(originalActivity),
            originalActivity
        );
    });

    it('returns a vaild uuid', () => {
        const uuidFormat =
            /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;

        expect(testActivity.id).toMatch(uuidFormat);
    });

    it('return the expected title', () => {
        expect(testActivity.getTitle).toEqual(testTitle);
    });

    test('it is possible to update the title', () => {
        const newTitle = 'NewTitle';

        testActivity.setTitle = newTitle;
        expect(testActivity.getTitle).toEqual(newTitle);
    });

    it('returns the expected description', () => {
        expect(testActivity.getDescription).toEqual(testDescription);
    });

    test('it is possible to update the description', () => {
        const newDescription = 'NewDescription';

        testActivity.setDescription = newDescription;

        expect(testActivity.getDescription).toEqual(newDescription);
    });

    it('returns start time in miliseconds', () => {
        const now = Date.now();
        const nowLength = now.toString().length;

        expect(testActivity.getStartTime.toString().length).toEqual(nowLength);
    });

    test('it is possible to update the start time', () => {
        const newTime = Date.now();
        testActivity.setStartTime = newTime;

        expect(testActivity.getStartTime).toEqual(newTime);
    });
});
