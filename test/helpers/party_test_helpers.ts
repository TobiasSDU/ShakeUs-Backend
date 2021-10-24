import { getCollection, req } from '../controllers/endpoint_tests_setup';

const partiesCollectionName = 'parties';

export const getTestParty = async (partyId: string, guestId: string) => {
    return await req.get('/party/show').send({
        partyId: partyId,
        guestId: guestId,
    });
};

export const testParty = async (
    partyId: string,
    hostsArray: string[],
    primaryHostId: string,
    guestsArray: string[],
    activityPackId: string
) => {
    const party = await (
        await getCollection(partiesCollectionName)
    ).findOne({
        _id: partyId,
    });

    if (party) {
        expect(partyId).toBeTruthy();
        expect(hostsArray).toBeTruthy();
        expect(primaryHostId).toBeTruthy();
        expect(guestsArray).toBeTruthy();
        expect(activityPackId).toBeTruthy();
        expect(party._id).toEqual(partyId);
        expect(party.hosts).toEqual(hostsArray);
        expect(party.primaryHost).toEqual(primaryHostId);
        expect(party.guests).toEqual(guestsArray);
        expect(party.activityPackId).toEqual(activityPackId);
    } else {
        throw new Error('party not found');
    }
};
