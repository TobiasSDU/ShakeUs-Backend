import { Collection, Db } from 'mongodb';
import { app } from '..';
import { getDatabase } from '../../config/database_connection';
import { Guest } from '../models/guest';
import { Party } from '../models/party';
import { GuestService } from './guest_service';
import { SocketService } from './socket_service';
import { ActivityPackService } from './activity_pack_service';
import { createActivityPackFromTemplate } from '../templates/default_activity_packs';

export class PartyService {
    public static async createParty(party: Party, host: Guest) {
        const collection = await this.getPartiesCollection();

        const createHostResult = await GuestService.createGuest(host);
        const activityPack = await ActivityPackService.showActivityPack(
            party.getActivityPackId
        );

        if (activityPack == null) {
            const activityPackId = await createActivityPackFromTemplate(
                party.getActivityPackId
            );
            party.setActivityPackId = activityPackId;
        }

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
                queryResult.hosts,
                queryResult.primaryHost,
                queryResult.guests,
                queryResult.activityPackId
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
                { $set: { activityPackId: activityPackId } }
            );

            if (updateResult.modifiedCount == 1) {
                const newActivityPack =
                    await ActivityPackService.showActivityPack(activityPackId);
                const socketService: SocketService = app.get('socketService');
                if (newActivityPack) {
                    socketService.emitToRoom(
                        'activity-pack-updated',
                        {
                            ...newActivityPack,
                            message:
                                'Activity pack has been updated to: ' +
                                newActivityPack.getTitle,
                        },
                        partyId
                    );
                }
            }

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
                { $set: { primaryHost: newPrimary } }
            );

            if (updateResult.modifiedCount == 1) {
                const socketService: SocketService = app.get('socketService');
                socketService.emitToRoom(
                    'primary-host-updated',
                    {
                        partyId: partyId,
                        newPrimaryHostId: newPrimary,
                        message: 'The primary host has been updated',
                    },
                    partyId
                );
            }

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
        const newHost = await GuestService.getGuestInfo(newHostId);

        if (await this.isUserAHost(hostId, partyId)) {
            const removeResult = await collection.updateOne(
                { _id: partyId },
                { $pull: { guests: newHostId } }
            );

            if (removeResult.acknowledged) {
                const addResult = await collection.updateOne(
                    { _id: partyId },
                    { $push: { hosts: newHostId } }
                );

                if (addResult.acknowledged) {
                    const socketService: SocketService =
                        app.get('socketService');
                    if (newHost) {
                        socketService.emitToRoom(
                            'guest-promoted',
                            {
                                newHostId: newHostId,
                                newHostName: newHost.getName,
                                message:
                                    newHost.getName +
                                    ' has been promoted to host',
                            },
                            partyId
                        );
                    }
                }

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
        const removedHost = await GuestService.getGuestInfo(removedHostId);

        if (await this.isUserPrimaryHost(primaryHostId, partyId)) {
            const removeResult = await collection.updateOne(
                { _id: partyId },
                { $pull: { hosts: removedHostId } }
            );

            if (removeResult.modifiedCount == 1) {
                const insertResult = await collection.updateOne(
                    { _id: partyId },
                    { $push: { guests: removedHostId } }
                );

                const socketService: SocketService = app.get('socketService');
                if (removedHost) {
                    socketService.emitToRoom(
                        'host-demoted',
                        {
                            removedHostId: removedHostId,
                            removedHostName: removedHost.getName,
                            message:
                                removedHost.getName + ' is no longer a host',
                        },
                        partyId
                    );
                }

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
                { $pull: { guests: removedGuestId } }
            );

            if (removeResult.modifiedCount == 1) {
                const deleteResult = await GuestService.deleteGuest(
                    removedGuestId
                );

                if (deleteResult) {
                    const socketService: SocketService =
                        app.get('socketService');
                    socketService.emitToRoom(
                        'guest-removed',
                        {
                            partyId: partyId,
                            removedGuestId: removedGuestId,
                            message: 'A guest has been removed from the party',
                        },
                        partyId
                    );
                }
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
            { $push: { guests: newGuest.id } }
        );

        if (updateResult.modifiedCount > 0) {
            const insertResult = await GuestService.createGuest(newGuest);

            if (insertResult) {
                const socketService: SocketService = app.get('socketService');
                socketService.emitToRoom(
                    'user-joined-party',
                    {
                        guestId: newGuest.id,
                        guestName: newGuest.getName,
                        message: newGuest.getName + ' joined the room',
                    },
                    partyId
                );
            }
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
            const userObject: Guest | undefined =
                await GuestService.getGuestInfo(userId);
            const deleteResult = await GuestService.deleteGuest(userId);

            if (deleteResult) {
                const socketService: SocketService = app.get('socketService');
                if (userObject) {
                    socketService.emitToRoom(
                        'user-left-party',
                        {
                            userId: userId,
                            userName: userObject.getName,
                            message: userObject.getName + ' left the room',
                        },
                        partyId
                    );
                }

                if (isHost) {
                    const removeResult = await collection.updateOne(
                        { _id: partyId },
                        { $pull: { hosts: userId } }
                    );

                    return removeResult.modifiedCount;
                } else {
                    const removeResult = await collection.updateOne(
                        { _id: partyId },
                        { $pull: { guests: userId } }
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
            const party = await this.getPartyInfo(partyId, primaryHostId);

            if (party) {
                const deleteUsersResult = await this.deleteAllGuestsAndHosts(
                    partyId
                );

                const deleteActivitiesResult =
                    await ActivityPackService.deleteActivityPack(
                        party.getActivityPackId
                    );

                if (deleteUsersResult && deleteActivitiesResult) {
                    const deleteResult = await collection.deleteOne({
                        _id: partyId,
                    });

                    const socketService: SocketService =
                        app.get('socketService');
                    socketService.emitToRoom(
                        'party-deleted',
                        { partyId: partyId, message: 'The party has ended' },
                        partyId
                    );

                    return deleteResult.acknowledged;
                }
            }
        }

        return false;
    }

    public static async getPartyByActivityPackId(activityPackId: string) {
        const collection = await this.getPartiesCollection();

        const queryResult = await collection.findOne({
            activityPackId: activityPackId,
        });

        return queryResult;
    }

    public static async getPartyByUserId(userId: string) {
        const collection = await this.getPartiesCollection();

        const queryResult = await collection.findOne({
            $or: [{ guests: userId }, { hosts: userId }],
        });

        return queryResult;
    }

    private static async getPartiesCollection(): Promise<Collection> {
        const db: Db = await getDatabase();
        return db.collection('parties');
    }

    private static isUserInParty(userId: string, party: Party) {
        let isUserInParty = false;

        party.getGuests.forEach((guest) => {
            if (guest == userId) {
                isUserInParty = true;
            }
        });

        party.getHosts.forEach((host) => {
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
            return party.primaryHost == hostId;
        } else {
            return false;
        }
    }

    public static async isUserAHost(hostId: string, partyId: string) {
        const collection = await this.getPartiesCollection();
        const party = await collection.findOne({ _id: partyId });

        if (party) {
            return this.isUserInHosts(hostId, party.hosts);
        } else {
            return false;
        }
    }

    private static async deleteAllGuestsAndHosts(partyId: string) {
        const collection = await this.getPartiesCollection();
        const party = await collection.findOne({ _id: partyId });

        if (party) {
            const guests = party.guests;
            const hosts = party.hosts;

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
