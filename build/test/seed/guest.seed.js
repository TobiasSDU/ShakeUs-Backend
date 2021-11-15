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
exports.seedGuestsCollection = exports.testGuest3 = exports.testGuest2 = exports.testGuest1 = void 0;
const guest_1 = require("../../src/models/guest");
const endpoint_tests_setup_1 = require("../controllers/endpoint_tests_setup");
exports.testGuest1 = new guest_1.Guest('TestGuest1', 'TestGuest1Name', 'TestToken1');
exports.testGuest2 = new guest_1.Guest('TestGuest2', 'TestGuest2Name', 'TestToken2');
exports.testGuest3 = new guest_1.Guest('TestGuest3', 'TestGuest3Name', 'TestToken3');
const seedGuestsCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const guestsCollection = yield (0, endpoint_tests_setup_1.getCollection)('guests');
    const guestSeed = [Object.assign({}, exports.testGuest1), Object.assign({}, exports.testGuest2), Object.assign({}, exports.testGuest3)];
    return yield guestsCollection.insertMany(guestSeed).then((result) => {
        return result.acknowledged;
    });
});
exports.seedGuestsCollection = seedGuestsCollection;
