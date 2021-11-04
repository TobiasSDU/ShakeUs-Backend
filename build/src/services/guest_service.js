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
                guest = new guest_1.Guest(queryResult._id, queryResult.name);
                return guest;
            }
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
                        message: 'The party has ended',
                    }, party._id);
                }
            }
            return modCount > 0;
        });
    }
    static deleteGuest(guestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getGuestsCollection();
            const deleteResult = yield collection.deleteOne({ _id: guestId });
            return deleteResult.acknowledged;
        });
    }
    static getGuestsCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_connection_1.getDatabase)((0, database_connection_1.getDbConnectionString)());
            return db.collection('guests');
        });
    }
}
exports.GuestService = GuestService;
