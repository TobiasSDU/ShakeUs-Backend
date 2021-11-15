"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyService = void 0;
const __1 = require("..");
const database_connection_1 = require("../../config/database_connection");
const party_1 = require("../models/party");
const guest_service_1 = require("./guest_service");
const activity_pack_service_1 = require("./activity_pack_service");
const default_activity_packs_1 = require("../templates/default_activity_packs");
class PartyService {
    static createParty(party, host) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const createHostResult = yield guest_service_1.GuestService.createGuest(host);
            const activityPack = yield activity_pack_service_1.ActivityPackService.showActivityPack(party.getActivityPackId);
            if (activityPack == null) {
                const activityPackId = yield (0, default_activity_packs_1.createActivityPackFromTemplate)(party.getActivityPackId);
                party.setActivityPackId = activityPackId;
            }
            if (createHostResult) {
                const insertResult = yield collection.insertOne(Object.assign({}, party));
                return insertResult.acknowledged;
            }
            else {
                return false;
            }
        });
    }
    static getPartyInfo(partyId, guestId) {
        return __awaiter(this, void 0, void 0, function* () {
            let party;
            const collection = yield this.getPartiesCollection();
            const queryResult = yield collection.findOne({ _id: partyId });
            if (queryResult) {
                party = new party_1.Party(queryResult._id, queryResult.hosts, queryResult.primaryHost, queryResult.guests, queryResult.activityPackId);
                if (this.isUserInParty(guestId, party)) {
                    return party;
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        });
    }
    static updateActivityPack(partyId, primaryHostId, activityPackId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isUserPrimaryHost(primaryHostId, partyId)) {
                const collection = yield this.getPartiesCollection();
                const updateResult = yield collection.updateOne({ _id: partyId }, { $set: { activityPackId: activityPackId } });
                if (updateResult.modifiedCount == 1) {
                    const newActivityPack = yield activity_pack_service_1.ActivityPackService.showActivityPack(activityPackId);
                    const socketService = __1.app.get('socketService');
                    if (newActivityPack) {
                        socketService.emitToRoom('activity-pack-updated', Object.assign(Object.assign({}, newActivityPack), { message: 'Activity pack has been updated to: ' +
                                newActivityPack.getTitle }), partyId);
                    }
                }
                return updateResult.acknowledged;
            }
            else {
                return false;
            }
        });
    }
    static updatePrimaryHost(partyId, currentPrimary, newPrimary) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            if (yield this.isUserPrimaryHost(currentPrimary, partyId)) {
                const updateResult = yield collection.updateOne({ _id: partyId }, { $set: { primaryHost: newPrimary } });
                if (updateResult.modifiedCount == 1) {
                    const socketService = __1.app.get('socketService');
                    socketService.emitToRoom('primary-host-updated', {
                        partyId: partyId,
                        newPrimaryHostId: newPrimary,
                        message: 'The primary host has been updated',
                    }, partyId);
                }
                return updateResult.acknowledged;
            }
            else {
                return false;
            }
        });
    }
    static addNewHost(partyId, hostId, newHostId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const newHost = yield guest_service_1.GuestService.getGuestInfo(newHostId);
            if (yield this.isUserAHost(hostId, partyId)) {
                const removeResult = yield collection.updateOne({ _id: partyId }, { $pull: { guests: newHostId } });
                if (removeResult.acknowledged) {
                    const addResult = yield collection.updateOne({ _id: partyId }, { $push: { hosts: newHostId } });
                    if (addResult.acknowledged) {
                        const socketService = __1.app.get('socketService');
                        if (newHost) {
                            socketService.emitToRoom('guest-promoted', {
                                newHostId: newHostId,
                                newHostName: newHost.getName,
                                message: newHost.getName +
                                    ' has been promoted to host',
                            }, partyId);
                        }
                    }
                    return addResult.acknowledged;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        });
    }
    static removeHost(partyId, primaryHostId, removedHostId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const removedHost = yield guest_service_1.GuestService.getGuestInfo(removedHostId);
            if (yield this.isUserPrimaryHost(primaryHostId, partyId)) {
                const removeResult = yield collection.updateOne({ _id: partyId }, { $pull: { hosts: removedHostId } });
                if (removeResult.modifiedCount == 1) {
                    const insertResult = yield collection.updateOne({ _id: partyId }, { $push: { guests: removedHostId } });
                    const socketService = __1.app.get('socketService');
                    if (removedHost) {
                        socketService.emitToRoom('host-demoted', {
                            removedHostId: removedHostId,
                            removedHostName: removedHost.getName,
                            message: removedHost.getName + ' is no longer a host',
                        }, partyId);
                    }
                    return insertResult.acknowledged;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        });
    }
    static removeGuest(partyId, hostId, removedGuestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            if (yield this.isUserAHost(hostId, partyId)) {
                const removeResult = yield collection.updateOne({ _id: partyId }, { $pull: { guests: removedGuestId } });
                if (removeResult.modifiedCount == 1) {
                    const deleteResult = yield guest_service_1.GuestService.deleteGuest(removedGuestId);
                    if (deleteResult) {
                        const socketService = __1.app.get('socketService');
                        socketService.emitToRoom('guest-removed', {
                            partyId: partyId,
                            removedGuestId: removedGuestId,
                            message: 'A guest has been removed from the party',
                        }, partyId);
                    }
                    return deleteResult;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        });
    }
    static joinParty(partyId, newGuest) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const updateResult = yield collection.updateOne({ _id: partyId }, { $push: { guests: newGuest.id } });
            if (updateResult.modifiedCount > 0) {
                const insertResult = yield guest_service_1.GuestService.createGuest(newGuest);
                if (insertResult) {
                    const socketService = __1.app.get('socketService');
                    socketService.emitToRoom('user-joined-party', {
                        guestId: newGuest.id,
                        guestName: newGuest.getName,
                        message: newGuest.getName + ' joined the room',
                    }, partyId);
                }
                return insertResult;
            }
            else {
                return false;
            }
        });
    }
    static leaveParty(partyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const party = yield this.getPartyInfo(partyId, userId); // Not null if user is in party
            const isHost = yield this.isUserAHost(userId, partyId);
            const isPrimaryHost = yield this.isUserPrimaryHost(userId, partyId);
            if (!isPrimaryHost && party) {
                const userObject = yield guest_service_1.GuestService.getGuestInfo(userId);
                const deleteResult = yield guest_service_1.GuestService.deleteGuest(userId);
                if (deleteResult) {
                    const socketService = __1.app.get('socketService');
                    if (userObject) {
                        socketService.emitToRoom('user-left-party', {
                            userId: userId,
                            userName: userObject.getName,
                            message: userObject.getName + ' left the room',
                        }, partyId);
                    }
                    if (isHost) {
                        const removeResult = yield collection.updateOne({ _id: partyId }, { $pull: { hosts: userId } });
                        return removeResult.modifiedCount;
                    }
                    else {
                        const removeResult = yield collection.updateOne({ _id: partyId }, { $pull: { guests: userId } });
                        return removeResult.modifiedCount;
                    }
                }
                else {
                    return 0;
                }
            }
            else {
                return 0;
            }
        });
    }
    static deleteParty(partyId, primaryHostId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const isPrimaryHost = yield this.isUserPrimaryHost(primaryHostId, partyId);
            if (isPrimaryHost) {
                const party = yield this.getPartyInfo(partyId, primaryHostId);
                if (party) {
                    const deleteUsersResult = yield this.deleteAllGuestsAndHosts(partyId);
                    const deleteActivitiesResult = yield activity_pack_service_1.ActivityPackService.deleteActivityPack(party.getActivityPackId);
                    if (deleteUsersResult && deleteActivitiesResult) {
                        const deleteResult = yield collection.deleteOne({
                            _id: partyId,
                        });
                        const socketService = __1.app.get('socketService');
                        socketService.emitToRoom('party-deleted', { partyId: partyId, message: 'The party has ended' }, partyId);
                        return deleteResult.acknowledged;
                    }
                }
            }
            return false;
        });
    }
    static getPartyByActivityPackId(activityPackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const queryResult = yield collection.findOne({
                activityPackId: activityPackId,
            });
            return queryResult;
        });
    }
    static getPartyByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const queryResult = yield collection.findOne({
                $or: [{ guests: userId }, { hosts: userId }],
            });
            return queryResult;
        });
    }
    static getPartiesCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_connection_1.getDatabase)();
            return db.collection('parties');
        });
    }
    static isUserInParty(userId, party) {
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
    static isUserInHosts(userId, hostsArray) {
        let isUserAHost = false;
        hostsArray.forEach((host) => {
            if (host == userId) {
                isUserAHost = true;
            }
        });
        return isUserAHost;
    }
    static isUserPrimaryHost(hostId, partyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const party = yield collection.findOne({ _id: partyId });
            if (party) {
                return party.primaryHost == hostId;
            }
            else {
                return false;
            }
        });
    }
    static isUserAHost(hostId, partyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const party = yield collection.findOne({ _id: partyId });
            if (party) {
                return this.isUserInHosts(hostId, party.hosts);
            }
            else {
                return false;
            }
        });
    }
    static deleteAllGuestsAndHosts(partyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getPartiesCollection();
            const party = yield collection.findOne({ _id: partyId });
            if (party) {
                const guests = party.guests;
                const hosts = party.hosts;
                guests.forEach((guest) => __awaiter(this, void 0, void 0, function* () {
                    const deleteStatus = yield guest_service_1.GuestService.deleteGuest(guest);
                    if (!deleteStatus) {
                        return false;
                    }
                }));
                hosts.forEach((host) => __awaiter(this, void 0, void 0, function* () {
                    const deleteStatus = yield guest_service_1.GuestService.deleteGuest(host);
                    if (!deleteStatus) {
                        return false;
                    }
                }));
                return true;
            }
            else {
                return false;
            }
        });
    }
}
exports.PartyService = PartyService;
