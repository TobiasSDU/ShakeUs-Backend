"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const remove_array_element_1 = require("../../src/util/remove_array_element");
const originalTestNumbers = [1, 2, 3, 4, 5];
const originalTestStrings = ['teststring1', 'teststring2', 'teststring3'];
describe('elements are removed from number arrays', () => {
    let testNumbersArray;
    beforeEach(() => {
        testNumbersArray = originalTestNumbers.slice();
    });
    it('does not contain the number "1"', () => {
        const removedElement = 1;
        (0, remove_array_element_1.removeArrayElement)(testNumbersArray, removedElement);
        expect(testNumbersArray).toEqual(expect.not.arrayContaining([removedElement]));
    });
    it('does not contain the number "5"', () => {
        const removedElement = 5;
        (0, remove_array_element_1.removeArrayElement)(testNumbersArray, removedElement);
        expect(testNumbersArray).toEqual(expect.not.arrayContaining([removedElement]));
    });
    it('does not remove anything from the array if a value that is not in the array is passed', () => {
        const removedElement = 8;
        (0, remove_array_element_1.removeArrayElement)(testNumbersArray, removedElement);
        expect(testNumbersArray).toEqual(originalTestNumbers);
    });
    it('does not crash if an empty array is used', () => {
        const removedElement = 5;
        const testArray = [];
        (0, remove_array_element_1.removeArrayElement)(testArray, removedElement);
        expect(testArray).toEqual([]);
    });
});
describe('elements are removed from string arrays', () => {
    let testStringArray;
    beforeEach(() => {
        testStringArray = originalTestStrings.slice();
    });
    it('does not contain the string "teststring1"', () => {
        const removedElement = 'teststring1';
        (0, remove_array_element_1.removeArrayElement)(testStringArray, removedElement);
        expect(testStringArray).toEqual(expect.not.arrayContaining([removedElement]));
    });
    it('does not contain the string "teststring3"', () => {
        const removedElement = 'teststring3';
        (0, remove_array_element_1.removeArrayElement)(testStringArray, removedElement);
        expect(testStringArray).toEqual(expect.not.arrayContaining([removedElement]));
    });
    it('does not remove anything from the array if a value that is not in the array is passed', () => {
        const removedElement = 'teststring8';
        (0, remove_array_element_1.removeArrayElement)(testStringArray, removedElement);
        expect(testStringArray).toEqual(originalTestStrings);
    });
    it('does not crash if an empty array is used', () => {
        const removedElement = 'teststring3';
        const testArray = [];
        (0, remove_array_element_1.removeArrayElement)(testArray, removedElement);
        expect(testArray).toEqual([]);
    });
});
