import { getCollection } from '../controllers/endpoint_tests_setup';

const guestsCollectionName = 'guests';

export const testHostOrGuest = async (userId: string, userName: string) => {
    const host = await (
        await getCollection(guestsCollectionName)
    ).findOne({
        _id: userId,
    });

    if (host) {
        expect(userId).toBeTruthy();
        expect(userName).toBeTruthy();
        expect(host._id).toEqual(userId);
        expect(host._name).toEqual(userName);
    } else {
        throw new Error('host not found');
    }
};
