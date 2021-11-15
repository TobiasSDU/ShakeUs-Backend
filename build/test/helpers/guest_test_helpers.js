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
exports.testHostOrGuest = exports.getTestGuest = void 0;
const endpoint_tests_setup_1 = require("../controllers/endpoint_tests_setup");
const guestsCollectionName = 'guests';
const getTestGuest = (guestId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield endpoint_tests_setup_1.req.get(`/guest/${guestId}`).send();
});
exports.getTestGuest = getTestGuest;
const testHostOrGuest = (userId, userName) => __awaiter(void 0, void 0, void 0, function* () {
    const host = yield (yield (0, endpoint_tests_setup_1.getCollection)(guestsCollectionName)).findOne({
        _id: userId,
    });
    if (host) {
        expect(userId).toBeTruthy();
        expect(userName).toBeTruthy();
        expect(host._id).toEqual(userId);
        expect(host.name).toEqual(userName);
    }
    else {
        throw new Error('host not found');
    }
});
exports.testHostOrGuest = testHostOrGuest;
