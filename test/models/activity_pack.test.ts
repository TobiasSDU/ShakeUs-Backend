import { ActivityPack } from '../../src/models/activity_pack';
import { generateUUID } from '../../src/util/uuid_generator';

const testId = generateUUID();
const testTitle = 'TestTitle';
const testDescription = 'TestDescription';
const originalActivityPack = new ActivityPack(
    testId,
    testTitle,
    testDescription,
    []
);

describe('activity pack model methods return expected values', () => {
    let testPack: ActivityPack;

    beforeEach(() => {
        testPack = Object.assign(
            Object.getPrototypeOf(originalActivityPack),
            originalActivityPack
        );
    });

    it('returns a vaild uuid', () => {
        const uuidFormat =
            /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;

        expect(testPack.id).toMatch(uuidFormat);
    });

    it('return the expected title', () => {
        expect(testPack.getTitle).toEqual(testTitle);
    });

    test('it is possible to update the title', () => {
        const newTitle = 'NewTitle';

        testPack.setTitle = newTitle;
        expect(testPack.getTitle).toEqual(newTitle);
    });

    it('returns the expected description', () => {
        expect(testPack.getDescription).toEqual(testDescription);
    });

    test('it is possible to update the description', () => {
        const newDescription = 'NewDescription';

        testPack.setDescription = newDescription;

        expect(testPack.getDescription).toEqual(newDescription);
    });

    test('the activities array is empty initially', () => {
        expect(testPack.getActivities.length).toEqual(0);
    });

    test('it is possible to set and get the value of the activities array', () => {
        const testActivities = ['activity1', 'activity2', 'activity3'];
        testPack.setActivities = testActivities;

        expect(testPack.getActivities).toEqual(testActivities);
    });

    it('is possible to add an activity to the activities array', () => {
        testPack.addActivity('activity1');

        expect(testPack.getActivities).toEqual(['activity1']);
    });

    it('is possible to remove an activity from the activities array', () => {
        const testActivities = ['activity1', 'activity2', 'activity3'];
        testPack.setActivities = testActivities;

        testPack.removeActivity('activity3');

        expect(testPack.getActivities).toEqual(
            expect.not.arrayContaining(['activity3'])
        );
    });

    it('is possible to remove all activities from the activity array', () => {
        const testActivities = ['activity1', 'activity2', 'activity3'];
        testPack.setActivities = testActivities;

        testPack.removeAllActivities();

        expect(testPack.getActivities).toEqual([]);
    });
});
