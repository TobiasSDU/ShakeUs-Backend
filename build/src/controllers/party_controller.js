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
exports.deleteParty = exports.leaveParty = exports.joinParty = exports.removeGuest = exports.removeHost = exports.addHost = exports.updateParty = exports.showParty = exports.createParty = void 0;
const uuid_generator_1 = require("../util/uuid_generator");
const guest_1 = require("../models/guest");
const party_1 = require("../models/party");
const party_service_1 = require("../services/party_service");
const party_id_generator_1 = require("../util/party_id_generator");
const guest_service_1 = require("./../services/guest_service");
const createParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = (0, party_id_generator_1.generatePartyId)();
    const activityPackId = req.body.activityPackId;
    const hostName = req.body.hostName;
    const hostNotificationToken = req.body.hostNotificationToken;
    const host = new guest_1.Guest((0, uuid_generator_1.generateUUID)(), hostName, hostNotificationToken);
    if (partyId && host && activityPackId && hostNotificationToken) {
        const party = new party_1.Party(partyId, [host.id], host.id, [], activityPackId);
        const insertResult = yield party_service_1.PartyService.createParty(party, host);
        if (insertResult) {
            return res.json({
                hostId: host.id,
                partyId: partyId,
                hostNotificationToken: hostNotificationToken,
            });
        }
    }
    return res.sendStatus(400);
});
exports.createParty = createParty;
const showParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.params.partyId;
    const guestId = req.params.guestId;
    if (partyId && guestId) {
        const party = yield party_service_1.PartyService.getPartyInfo(partyId, guestId);
        if (party) {
            return res.json(party);
        }
    }
    return res.sendStatus(400);
});
exports.showParty = showParty;
const updateParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.body.partyId;
    const primaryHostId = req.body.primaryHostId;
    const newActivityPackId = req.body.newActivityPackId;
    const newPrimary = req.body.newPrimary;
    const resultsArray = [];
    if (partyId && primaryHostId) {
        if (newActivityPackId) {
            resultsArray.push(yield updateActivityPack(partyId, primaryHostId, newActivityPackId));
        }
        if (newPrimary) {
            resultsArray.push(yield updatePrimaryHost(partyId, primaryHostId, newPrimary));
        }
        if (!resultsArray.includes(false)) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.updateParty = updateParty;
const updateActivityPack = (partyId, primaryHostId, newActivityPackId) => __awaiter(void 0, void 0, void 0, function* () {
    if (partyId && primaryHostId && newActivityPackId) {
        const updateResult = yield party_service_1.PartyService.updateActivityPack(partyId, primaryHostId, newActivityPackId);
        if (updateResult) {
            return true;
        }
    }
    return false;
});
const updatePrimaryHost = (partyId, currentPrimary, newPrimary) => __awaiter(void 0, void 0, void 0, function* () {
    if (partyId && currentPrimary && newPrimary) {
        const updateResult = yield party_service_1.PartyService.updatePrimaryHost(partyId, currentPrimary, newPrimary);
        if (updateResult) {
            return true;
        }
    }
    return false;
});
const addHost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.body.partyId;
    const hostId = req.body.hostId;
    const newHostId = req.body.newHostId;
    if (partyId && hostId && newHostId) {
        const updateResult = yield party_service_1.PartyService.addNewHost(partyId, hostId, newHostId);
        if (updateResult) {
            return res.sendStatus(200);
        }
        return res.sendStatus(400);
    }
    return res.sendStatus(400);
});
exports.addHost = addHost;
const removeHost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.body.partyId;
    const primaryHostId = req.body.primaryHostId;
    const removedHostId = req.body.removedHostId;
    if (partyId && primaryHostId && removedHostId) {
        if (primaryHostId == removedHostId) {
            return res.sendStatus(403);
        }
        const updateResult = yield party_service_1.PartyService.removeHost(partyId, primaryHostId, removedHostId);
        if (updateResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.removeHost = removeHost;
const removeGuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.body.partyId;
    const hostId = req.body.hostId;
    const removedGuestId = req.body.removedGuestId;
    if (partyId && hostId && removedGuestId) {
        const updateResult = yield party_service_1.PartyService.removeGuest(partyId, hostId, removedGuestId);
        if (updateResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.removeGuest = removeGuest;
const joinParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.body.partyId;
    const guestName = req.body.guestName;
    const guestNotificationToken = req.body.guestNotificationToken;
    if (partyId && guestName && guestNotificationToken) {
        const newGuest = new guest_1.Guest((0, uuid_generator_1.generateUUID)(), guestName, guestNotificationToken);
        const updateResult = yield party_service_1.PartyService.joinParty(partyId, newGuest);
        if (updateResult) {
            const responseValue = {
                newGuest: newGuest,
                guests: yield guest_service_1.GuestService.getGuestsByPartyId(partyId, newGuest.id),
                hosts: yield guest_service_1.GuestService.getHostsByPartyId(partyId, newGuest.id),
                primaryHost: yield guest_service_1.GuestService.getPrimaryHostByPartyId(partyId, newGuest.id),
            };
            return res.json(responseValue);
        }
    }
    return res.sendStatus(400);
});
exports.joinParty = joinParty;
const leaveParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.body.partyId;
    const userId = req.body.userId;
    if (partyId && userId) {
        const updateResult = yield party_service_1.PartyService.leaveParty(partyId, userId);
        if (updateResult > 0) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.leaveParty = leaveParty;
const deleteParty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partyId = req.body.partyId;
    const primaryHostId = req.body.primaryHostId;
    if (partyId && primaryHostId) {
        const deleteResult = yield party_service_1.PartyService.deleteParty(partyId, primaryHostId);
        if (deleteResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.deleteParty = deleteParty;
