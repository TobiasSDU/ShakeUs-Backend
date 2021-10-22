import { Collection, Db } from 'mongodb';
import { getDatabase } from './database_service';

export class GuestService {
    private static async getGuestsCollection(): Promise<Collection> {
        const db: Db = await getDatabase();
        return db.collection('parties');
    }
}
