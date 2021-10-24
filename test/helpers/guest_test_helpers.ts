import { getCollection, req } from '../controllers/endpoint_tests_setup';

const guestsCollectionName = 'guests';

export const getTestGuest = async (guestId: string) => {
    return await req.get('/guest/show').send({
        guestId: guestId,
    });
};

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
        expect(host.name).toEqual(userName);
    } else {
        throw new Error('host not found');
    }
};
