import { Collection, Db } from 'mongodb';
import { app } from '..';
import {
    getDatabase,
    getDbConnectionString,
} from '../../config/database_connection';
import { Guest } from '../models/guest';
import { PartyService } from './party_service';
import { SocketService } from './socket_service';

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
            guest = new Guest(queryResult._id, queryResult.name);

            return guest;
        }
    }

    public static async updateGuestName(guestId: string, newName: string) {
        const collection = await this.getGuestsCollection();
        const party = await PartyService.getPartyByUserId(guestId);

        const updateResult = await collection.updateOne(
            { _id: guestId },
            { $set: { name: newName } }
        );

        const modCount = updateResult.modifiedCount;

        if (modCount == 1) {
            const user = await GuestService.getGuestInfo(guestId);
            const socketService: SocketService = app.get('socketService');
            if (party && user) {
                socketService.emitToRoom(
                    'username-updated',
                    {
                        user: { ...user },
                        message: 'User has changed name',
                    },
                    party._id
                );
            }
        }

        return modCount > 0;
    }

    public static async deleteGuest(guestId: string) {
        const collection = await this.getGuestsCollection();
        const deleteResult = await collection.deleteOne({ _id: guestId });

        return deleteResult.acknowledged;
    }

    public static async getGuestsByPartyId(partyId: string, userId: string) {
        const collection = await this.getGuestsCollection();
        const party = await PartyService.getPartyInfo(partyId, userId);

        if (party) {
            const partyGuestsIds = party.getGuests;
            const queryGuests = await collection
                .find({
                    _id: { $in: partyGuestsIds },
                })
                .toArray();

            const guests = queryGuests.map((guest) => {
                return new Guest(guest._id, guest.name);
            });

            return guests;
        }

        return null;
    }

    public static async getHostsByPartyId(partyId: string, userId: string) {
        const collection = await this.getGuestsCollection();
        const party = await PartyService.getPartyInfo(partyId, userId);

        if (party) {
            const partyHostsIds = party.getHosts;
            const queryHosts = await collection
                .find({
                    _id: { $in: partyHostsIds },
                })
                .toArray();

            const hosts = queryHosts.map((host) => {
                return new Guest(host._id, host.name);
            });

            return hosts;
        }

        return null;
    }

    public static async getPrimaryHostByPartyId(
        partyId: string,
        userId: string
    ) {
        const collection = await this.getGuestsCollection();
        const party = await PartyService.getPartyInfo(partyId, userId);

        if (party) {
            const primaryHost = party.getPrimaryHost;
            const queryResult = await collection.findOne({
                _id: primaryHost,
            });

            if (queryResult) {
                return new Guest(queryResult._id, queryResult.name);
            }
        }

        return null;
    }

    private static async getGuestsCollection(): Promise<Collection> {
        const db: Db = await getDatabase(getDbConnectionString());

        return db.collection('guests');
    }
}
