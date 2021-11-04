"use strict";
/** Generates party ids of length 7. Each symbol in
 *  the id can have a value between 0-z (36 possible
 *  values). This means that there are 78.364.164.096
 *  possible combinations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePartyId = void 0;
const singleDigit = Array.from(Array(10).keys()).map((digit) => {
    return digit.toString();
});
const alphabetCodes = Array.from(Array(26)).map((arrayElement, index) => {
    return index + 97;
});
const alphabet = alphabetCodes.map((alphabetCode) => String.fromCharCode(alphabetCode));
const possibleCodeSymbols = singleDigit.concat(alphabet);
const getRandomDigitOrLetter = () => {
    const randomNumber = Math.floor(Math.random() * possibleCodeSymbols.length);
    return possibleCodeSymbols[randomNumber];
};
const generatePartyId = () => {
    let generatedId = '';
    for (let i = 0; i < 7; i++) {
        generatedId += getRandomDigitOrLetter();
    }
    return generatedId;
};
exports.generatePartyId = generatePartyId;
