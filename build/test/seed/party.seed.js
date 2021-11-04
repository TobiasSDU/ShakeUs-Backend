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
exports.seedPartiesCollection = exports.testParty2 = exports.testParty1 = void 0;
const party_1 = require("../../src/models/party");
const party_id_generator_1 = require("../../src/util/party_id_generator");
const endpoint_tests_setup_1 = require("../controllers/endpoint_tests_setup");
const activity_pack_seed_1 = require("./activity_pack.seed");
exports.testParty1 = new party_1.Party((0, party_id_generator_1.generatePartyId)(), ['TestHost1'], 'TestHost1', ['TestGuest1'], activity_pack_seed_1.testActivityPack1.id);
exports.testParty2 = new party_1.Party((0, party_id_generator_1.generatePartyId)(), ['TestHost2', 'TestHost3'], 'TestHost2', ['TestGuest2', 'TestGuest3'], activity_pack_seed_1.testActivityPack2.id);
const seedPartiesCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const partiesCollection = yield (0, endpoint_tests_setup_1.getCollection)('parties');
    const partySeed = [Object.assign({}, exports.testParty1), Object.assign({}, exports.testParty2)];
    return yield partiesCollection.insertMany(partySeed).then((result) => {
        return result.acknowledged;
    });
});
exports.seedPartiesCollection = seedPartiesCollection;
