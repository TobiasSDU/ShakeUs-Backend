import express from 'express';
import {
    addHost,
    createParty,
    deleteParty,
    joinParty,
    leaveParty,
    removeGuest,
    removeHost,
    showParty,
    updateParty,
} from '../controllers/party_controller';

export const partyRoutes = express.Router();

partyRoutes.post('', createParty);
partyRoutes.get('', showParty);
partyRoutes.patch('', updateParty);
partyRoutes.post('/add-host', addHost);
partyRoutes.post('/remove-host', removeHost);
partyRoutes.post('/remove-guest', removeGuest);
partyRoutes.post('/join', joinParty);
partyRoutes.post('/leave', leaveParty);
partyRoutes.delete('', deleteParty);
