import { Collection, Db } from 'mongodb';
import { Party } from '../models/party';
import { getDatabase } from './database.service';

export class PartyService {
    public static async createParty(party: Party) {
        const collection = await this.getPartiesCollection();
        const insertResult = await collection.insertOne({ ...party });

        return insertResult.acknowledged;
    }

    public static async getPartyInfo(partyId: string, guestId: string) {
        let party: Party;

        const collection = await this.getPartiesCollection();
        const queryResult = await collection.findOne({ _id: partyId });

        if (queryResult) {
            party = new Party(
                queryResult._id,
                queryResult._hosts,
                queryResult._primaryHost,
                queryResult._guests,
                queryResult._activityPackId
            );

            if (this.isGuestInParty(guestId, party)) {
                return party;
            }
        }
    }

    private static async getPartiesCollection(): Promise<Collection> {
        const db: Db = await getDatabase();
        return db.collection('parties');
    }

    private static isGuestInParty(guestId: string, party: Party) {
        let isGuestInParty = false;

        party.guests.forEach((guest) => {
            if (guest == guestId) {
                isGuestInParty = true;
            }
        });

        party.hosts.forEach((host) => {
            if (host == guestId) {
                isGuestInParty = true;
            }
        });

        return isGuestInParty;
    }
}
