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
    updateActivityPack,
    updatePrimaryHost,
} from '../controllers/party_controller';

export const partyRoutes = express.Router();

partyRoutes.post('/create', createParty);
partyRoutes.get('/show', showParty);
partyRoutes.patch('/activity-pack/update', updateActivityPack);
partyRoutes.patch('/hosts/primary/update', updatePrimaryHost);
partyRoutes.patch('/hosts/add', addHost);
partyRoutes.patch('/hosts/remove', removeHost);
partyRoutes.patch('/guests/remove', removeGuest);
partyRoutes.patch('/join', joinParty);
partyRoutes.patch('/leave', leaveParty);
partyRoutes.delete('/delete', deleteParty);
