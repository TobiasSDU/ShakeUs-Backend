import express from 'express';
import {
    addHost,
    createParty,
    joinParty,
    leaveParty,
    removeGuest,
    removeHost,
    showParty,
    updateParty,
} from '../controllers/party_controller';

export const partyRoutes = express.Router();

partyRoutes.post('/create', createParty);
partyRoutes.get('/show', showParty);
partyRoutes.get('/update', updateParty); // Primary host or activity pack
partyRoutes.get('/hosts/add', addHost);
partyRoutes.get('/hosts/remove', removeHost);
partyRoutes.get('/guests/remove', removeGuest);
partyRoutes.get('/join', joinParty);
partyRoutes.get('/leave', leaveParty);
