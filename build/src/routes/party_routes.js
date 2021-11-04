"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const party_controller_1 = require("../controllers/party_controller");
exports.partyRoutes = express_1.default.Router();
exports.partyRoutes.post("", party_controller_1.createParty);
exports.partyRoutes.get("/:partyId/:guestId", party_controller_1.showParty);
exports.partyRoutes.patch("", party_controller_1.updateParty);
exports.partyRoutes.post("/add-host", party_controller_1.addHost);
exports.partyRoutes.post("/remove-host", party_controller_1.removeHost);
exports.partyRoutes.post("/remove-guest", party_controller_1.removeGuest);
exports.partyRoutes.post("/join", party_controller_1.joinParty);
exports.partyRoutes.post("/leave", party_controller_1.leaveParty);
exports.partyRoutes.delete("", party_controller_1.deleteParty);
