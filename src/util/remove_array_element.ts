export const removeArrayElement = (
    array: number[] | string[],
    element: number | string
): void => {
    const index: number = getElementIndex(array, element);

    if (index > -1) {
        array.splice(index, 1);
    }
};

const getElementIndex = (
    array: number[] | string[],
    element: number | string
): number => {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
            return i;
        }
    }

    return -1;
};
