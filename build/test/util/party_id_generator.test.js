"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_id_generator_1 = require("../../src/util/party_id_generator");
describe('valid party ids are generated', () => {
    test('generated party id has the correct format', () => {
        const generatedId = (0, party_id_generator_1.generatePartyId)();
        const uuidFormat = /\b[0-9a-z]{7}\b/;
        expect(generatedId).toMatch(uuidFormat);
    });
    test('there are no duplicates in a set of 10.000 generated party ids', () => {
        const testArray = [];
        for (let i = 0; i < 10000; i++) {
            testArray.push((0, party_id_generator_1.generatePartyId)());
        }
        const setSize = new Set(testArray).size;
        expect(setSize === testArray.length).toEqual(true);
    });
});
