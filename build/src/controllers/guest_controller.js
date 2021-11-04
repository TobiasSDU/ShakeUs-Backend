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
exports.updateGuestName = exports.showGuest = void 0;
const guest_service_1 = require("../services/guest_service");
const showGuest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guestId = req.body.guestId;
    if (guestId) {
        const guest = yield guest_service_1.GuestService.getGuestInfo(guestId);
        if (guest) {
            return res.json(guest);
        }
    }
    return res.sendStatus(400);
});
exports.showGuest = showGuest;
const updateGuestName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guestId = req.body.guestId;
    const newName = req.body.newName;
    if (guestId && newName) {
        const updateResult = yield guest_service_1.GuestService.updateGuestName(guestId, newName);
        if (updateResult) {
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
});
exports.updateGuestName = updateGuestName;
