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
exports.GuestService = void 0;
const __1 = require("..");
const database_connection_1 = require("../../config/database_connection");
const guest_1 = require("../models/guest");
const party_service_1 = require("./party_service");
class GuestService {
    static createGuest(guest) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getGuestsCollection();
            const insertResult = yield collection.insertOne(Object.assign({}, guest));
            return insertResult.acknowledged;
        });
    }
    static getGuestInfo(guestId) {
        return __awaiter(this, void 0, void 0, function* () {
            let guest;
            const collection = yield this.getGuestsCollection();
            const queryResult = yield collection.findOne({ _id: guestId });
            if (queryResult) {
                guest = new guest_1.Guest(queryResult._id, queryResult.name, queryResult.notificationToken);
                return guest;
            }
        });
    }
    static getAllGuestsByPartyId(partyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getGuestsCollection();
            const party = yield party_service_1.PartyService.getPartyInfo(partyId, userId);
            if (party) {
                const partyGuestsIds = party.getGuests;
                const queryGuests = yield collection
                    .find({
                    _id: { $in: partyGuestsIds },
                })
                    .toArray();
                const guests = queryGuests.map((guest) => {
                    return new guest_1.Guest(guest._id, guest.name, guest.notificationToken);
                });
                return guests;
            }
            return null;
        });
    }
    static getAllHostsByPartyId(partyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getGuestsCollection();
            const party = yield party_service_1.PartyService.getPartyInfo(partyId, userId);
            if (party) {
                const partyHostsIds = party.getHosts;
                const queryHosts = yield collection
                    .find({
                    _id: { $in: partyHostsIds },
                })
                    .toArray();
                const hosts = queryHosts.map((host) => {
                    return new guest_1.Guest(host._id, host.name, host.notificationToken);
                });
                return hosts;
            }
            return null;
        });
    }
    static updateGuestName(guestId, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getGuestsCollection();
            const party = yield party_service_1.PartyService.getPartyByUserId(guestId);
            const updateResult = yield collection.updateOne({ _id: guestId }, { $set: { name: newName } });
            const modCount = updateResult.modifiedCount;
            if (modCount == 1) {
                const user = yield GuestService.getGuestInfo(guestId);
                const socketService = __1.app.get('socketService');
                if (party && user) {
                    socketService.emitToRoom('username-updated', {
                        user: Object.assign({}, user),
                        message: 'User has changed name',
                    }, party._id);
                }
            }
            return modCount > 0;
        });
    }
    static updateGuestNotificationToken(guestId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getGuestsCollection();
            const updateResult = yield collection.updateOne({ _id: guestId }, { $set: { notificationToken: token } });
            return updateResult.modifiedCount > 0;
        });
    }
    static deleteGuest(guestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getGuestsCollection();
            const deleteResult = yield collection.deleteOne({ _id: guestId });
            return deleteResult.acknowledged;
        });
    }
    static getGuestsByPartyId(partyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getGuestsCollection();
            const party = yield party_service_1.PartyService.getPartyInfo(partyId, userId);
            if (party) {
                const partyGuestsIds = party.getGuests;
                const queryGuests = yield collection
                    .find({
                    _id: { $in: partyGuestsIds },
                })
                    .toArray();
                const guests = queryGuests.map((guest) => {
                    return new guest_1.Guest(guest._id, guest.name, guest.notificationToken);
                });
                return guests;
            }
            return null;
        });
    }
    static getHostsByPartyId(partyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getGuestsCollection();
            const party = yield party_service_1.PartyService.getPartyInfo(partyId, userId);
            if (party) {
                const partyHostsIds = party.getHosts;
                const queryHosts = yield collection
                    .find({
                    _id: { $in: partyHostsIds },
                })
                    .toArray();
                const hosts = queryHosts.map((host) => {
                    return new guest_1.Guest(host._id, host.name, host.notificationToken);
                });
                return hosts;
            }
            return null;
        });
    }
    static getPrimaryHostByPartyId(partyId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getGuestsCollection();
            const party = yield party_service_1.PartyService.getPartyInfo(partyId, userId);
            if (party) {
                const primaryHost = party.getPrimaryHost;
                const queryResult = yield collection.findOne({
                    _id: primaryHost,
                });
                if (queryResult) {
                    return new guest_1.Guest(queryResult._id, queryResult.name, queryResult.notificationToken);
                }
            }
            return null;
        });
    }
    static getGuestsCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_connection_1.getDatabase)();
            return db.collection('guests');
        });
    }
}
exports.GuestService = GuestService;
