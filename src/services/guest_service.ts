import { Collection, Db } from 'mongodb';
import {
    getDatabase,
    getDbConnectionString,
} from '../config/database_connection';
import { Guest } from '../models/guest';

export class GuestService {
    public static async createGuest(guest: Guest) {
        const collection = await this.getGuestsCollection();
        const insertResult = await collection.insertOne({ ...guest });

        return insertResult.acknowledged;
    }

    public static async getGuestInfo(guestId: string) {
        let guest: Guest;

        const collection = await this.getGuestsCollection();
        const queryResult = await collection.findOne({ _id: guestId });

        if (queryResult) {
            guest = new Guest(queryResult._id, queryResult._name);

            return guest;
        }
    }

    public static async updateGuestName(guestId: string, newName: string) {
        const collection = await this.getGuestsCollection();
        const updateResult = await collection.updateOne(
            { _id: guestId },
            { $set: { _name: newName } }
        );

        return updateResult.acknowledged;
    }

    public static async deleteGuest(guestId: string) {
        const collection = await this.getGuestsCollection();
        const deleteResult = await collection.deleteOne({ _id: guestId });

        return deleteResult.acknowledged;
    }

    private static async getGuestsCollection(): Promise<Collection> {
        const db: Db = await getDatabase(getDbConnectionString('prod'));
        return db.collection('guests');
    }
}
