import { generatePartyId } from '../../src/util/party_id_generator';

describe('valid party ids are generated', () => {
    test('generated party id has the correct format', () => {
        const generatedId = generatePartyId();
        const uuidFormat = /\b[0-9a-z]{7}\b/;

        expect(generatedId).toMatch(uuidFormat);
    });

    test('there are no duplicates in a set of 10.000 generated party ids', () => {
        const testArray: string[] = [];

        for (let i = 0; i < 10000; i++) {
            testArray.push(generatePartyId());
        }

        const setSize = new Set(testArray).size;
        expect(setSize === testArray.length).toEqual(true);
    });
});
