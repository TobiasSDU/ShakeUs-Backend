import { Collection, Db } from 'mongodb';
import {
    getDatabase,
    getDbConnectionString,
} from '../../config/database_connection';
import { Guest } from '../models/guest';
import { Party } from '../models/party';
import { GuestService } from './guest_service';

export class PartyService {
    public static async createParty(party: Party, host: Guest) {
        const collection = await this.getPartiesCollection();

        const createHostResult = await GuestService.createGuest(host);

        if (createHostResult) {
            const insertResult = await collection.insertOne({ ...party });
            return insertResult.acknowledged;
        } else {
            return false;
        }
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

            if (this.isUserInParty(guestId, party)) {
                return party;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    public static async updateActivityPack(
        partyId: string,
        primaryHostId: string,
        activityPackId: string
    ) {
        if (await this.isUserPrimaryHost(primaryHostId, partyId)) {
            const collection = await this.getPartiesCollection();
            const updateResult = await collection.updateOne(
                { _id: partyId },
                { $set: { _activityPackId: activityPackId } }
            );

            return updateResult.acknowledged;
        } else {
            return false;
        }
    }

    public static async updatePrimaryHost(
        partyId: string,
        currentPrimary: string,
        newPrimary: string
    ) {
        const collection = await this.getPartiesCollection();

        if (await this.isUserPrimaryHost(currentPrimary, partyId)) {
            const updateResult = await collection.updateOne(
                { _id: partyId },
                { $set: { _primaryHost: newPrimary } }
            );

            return updateResult.acknowledged;
        } else {
            return false;
        }
    }

    public static async addNewHost(
        partyId: string,
        hostId: string,
        newHostId: string
    ) {
        const collection = await this.getPartiesCollection();

        if (await this.isUserAHost(hostId, partyId)) {
            const removeResult = await collection.updateOne(
                { _id: partyId },
                { $pull: { _guests: newHostId } }
            );

            if (removeResult.acknowledged) {
                const addResult = await collection.updateOne(
                    { _id: partyId },
                    { $push: { _hosts: newHostId } }
                );

                return addResult.acknowledged;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public static async removeHost(
        partyId: string,
        primaryHostId: string,
        removedHostId: string
    ) {
        const collection = await this.getPartiesCollection();

        if (await this.isUserPrimaryHost(primaryHostId, partyId)) {
            const removeResult = await collection.updateOne(
                { _id: partyId },
                { $pull: { _hosts: removedHostId } }
            );

            if (removeResult.modifiedCount == 1) {
                const insertResult = await collection.updateOne(
                    { _id: partyId },
                    { $push: { _guests: removedHostId } }
                );

                return insertResult.acknowledged;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public static async removeGuest(
        partyId: string,
        hostId: string,
        removedGuestId: string
    ) {
        const collection = await this.getPartiesCollection();

        if (await this.isUserAHost(hostId, partyId)) {
            const removeResult = await collection.updateOne(
                { _id: partyId },
                { $pull: { _guests: removedGuestId } }
            );

            if (removeResult.modifiedCount == 1) {
                const deleteResult = await GuestService.deleteGuest(
                    removedGuestId
                );
                return deleteResult;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public static async joinParty(partyId: string, newGuest: Guest) {
        const collection = await this.getPartiesCollection();

        const updateResult = await collection.updateOne(
            { _id: partyId },
            { $push: { _guests: newGuest.id } }
        );

        if (updateResult.modifiedCount > 0) {
            const insertResult = await GuestService.createGuest(newGuest);
            return insertResult;
        } else {
            return false;
        }
    }

    public static async leaveParty(partyId: string, userId: string) {
        const collection = await this.getPartiesCollection();
        const party = await this.getPartyInfo(partyId, userId); // Not null if user is in party
        const isHost = await this.isUserAHost(userId, partyId);
        const isPrimaryHost = await this.isUserPrimaryHost(userId, partyId);

        if (!isPrimaryHost && party) {
            const deleteResult = await GuestService.deleteGuest(userId);

            if (deleteResult) {
                if (isHost) {
                    const removeResult = await collection.updateOne(
                        { _id: partyId },
                        { $pull: { _hosts: userId } }
                    );

                    return removeResult.modifiedCount;
                } else {
                    const removeResult = await collection.updateOne(
                        { _id: partyId },
                        { $pull: { _guests: userId } }
                    );

                    return removeResult.modifiedCount;
                }
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    public static async deleteParty(partyId: string, primaryHostId: string) {
        const collection = await this.getPartiesCollection();
        const isPrimaryHost = await this.isUserPrimaryHost(
            primaryHostId,
            partyId
        );

        if (isPrimaryHost) {
            const deleteUsersResult = await this.deleteAllGuestsAndHosts(
                partyId
            );

            if (deleteUsersResult) {
                const deleteResult = await collection.deleteOne({
                    _id: partyId,
                });

                return deleteResult.acknowledged;
            } else {
                return false;
            }
        }

        return false;
    }

    private static async getPartiesCollection(): Promise<Collection> {
        const db: Db = await getDatabase(getDbConnectionString());
        return db.collection('parties');
    }

    private static isUserInParty(userId: string, party: Party) {
        let isUserInParty = false;

        party.guests.forEach((guest) => {
            if (guest == userId) {
                isUserInParty = true;
            }
        });

        party.hosts.forEach((host) => {
            if (host == userId) {
                isUserInParty = true;
            }
        });

        return isUserInParty;
    }

    private static isUserInHosts(userId: string, hostsArray: string[]) {
        let isUserAHost = false;

        hostsArray.forEach((host) => {
            if (host == userId) {
                isUserAHost = true;
            }
        });

        return isUserAHost;
    }

    private static async isUserPrimaryHost(hostId: string, partyId: string) {
        const collection = await this.getPartiesCollection();
        const party = await collection.findOne({ _id: partyId });

        if (party) {
            return party._primaryHost == hostId;
        } else {
            return false;
        }
    }

    private static async isUserAHost(hostId: string, partyId: string) {
        const collection = await this.getPartiesCollection();
        const party = await collection.findOne({ _id: partyId });

        if (party) {
            return this.isUserInHosts(hostId, party._hosts);
        } else {
            return false;
        }
    }

    private static async deleteAllGuestsAndHosts(partyId: string) {
        const collection = await this.getPartiesCollection();
        const party = await collection.findOne({ _id: partyId });

        if (party) {
            const guests = party._guests;
            const hosts = party._hosts;

            guests.forEach(async (guest: string) => {
                const deleteStatus = await GuestService.deleteGuest(guest);

                if (!deleteStatus) {
                    return false;
                }
            });

            hosts.forEach(async (host: string) => {
                const deleteStatus = await GuestService.deleteGuest(host);

                if (!deleteStatus) {
                    return false;
                }
            });

            return true;
        } else {
            return false;
        }
    }
}
