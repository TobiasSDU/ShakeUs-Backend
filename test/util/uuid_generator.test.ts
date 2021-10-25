import { generateUUID } from '../../src/util/uuid_generator';

describe('valid uuids are generated', () => {
    test('generated uuid has the correct format', () => {
        const generatedUUID = generateUUID();
        const uuidFormat =
            /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;

        expect(generatedUUID).toMatch(uuidFormat);
    });

    test('there are no duplicates in a set of 10.000 generated uuids', () => {
        const testArray: string[] = [];

        for (let i = 0; i < 10000; i++) {
            testArray.push(generateUUID());
        }

        const setSize = new Set(testArray).size;
        expect(setSize === testArray.length).toEqual(true);
    });
});
