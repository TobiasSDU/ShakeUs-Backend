"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeArrayElement = void 0;
const removeArrayElement = (array, element) => {
    const index = getElementIndex(array, element);
    if (index > -1) {
        array.splice(index, 1);
    }
};
exports.removeArrayElement = removeArrayElement;
const getElementIndex = (array, element) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
            return i;
        }
    }
    return -1;
};
