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
exports.testParty = exports.getTestParty = void 0;
const endpoint_tests_setup_1 = require("../controllers/endpoint_tests_setup");
const partiesCollectionName = 'parties';
const getTestParty = (partyId, guestId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield endpoint_tests_setup_1.req.get('/party').send({
        partyId: partyId,
        guestId: guestId,
    });
});
exports.getTestParty = getTestParty;
const testParty = (partyId, hostsArray, primaryHostId, guestsArray) => __awaiter(void 0, void 0, void 0, function* () {
    const party = yield (yield (0, endpoint_tests_setup_1.getCollection)(partiesCollectionName)).findOne({
        _id: partyId,
    });
    if (party) {
        expect(partyId).toBeTruthy();
        expect(hostsArray).toBeTruthy();
        expect(primaryHostId).toBeTruthy();
        expect(guestsArray).toBeTruthy();
        expect(party._id).toEqual(partyId);
        expect(party.hosts).toEqual(hostsArray);
        expect(party.primaryHost).toEqual(primaryHostId);
        expect(party.guests).toEqual(guestsArray);
    }
    else {
        throw new Error('party not found');
    }
});
exports.testParty = testParty;
