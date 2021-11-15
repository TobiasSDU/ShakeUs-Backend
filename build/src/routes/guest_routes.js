"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const guest_controller_1 = require("../controllers/guest_controller");
exports.guestRoutes = express_1.default.Router();
exports.guestRoutes.patch('', guest_controller_1.updateGuestName);
exports.guestRoutes.get('/:guestId', guest_controller_1.showGuest);
exports.guestRoutes.get('/get-all/:partyId/:userId', guest_controller_1.getAllGuestsByPartyId);
