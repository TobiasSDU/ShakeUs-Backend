import { generateUUID } from '../../src/util/uuid_generator';

describe('valid uuids are generated', () => {
    let generatedUUID: string;

    beforeEach(() => {
        generatedUUID = generateUUID();
    });

    it('has the correct format', () => {
        const uuidFormat =
            /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;

        expect(generatedUUID).toMatch(uuidFormat);
    });

    test('there are no duplicates in a set of 10.000 generated ids', () => {
        const testArray: string[] = [];

        for (let i = 0; i < 10000; i++) {
            testArray.push(generateUUID());
        }

        const setSize = new Set(testArray).size;
        expect(setSize === testArray.length).toEqual(true);
    });
});
