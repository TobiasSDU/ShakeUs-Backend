import express from 'express';
import {
    getAllGuestsByPartyId,
    showGuest,
    updateGuestName,
} from '../controllers/guest_controller';

export const guestRoutes = express.Router();

guestRoutes.patch('', updateGuestName);
guestRoutes.get('/:guestId', showGuest);
guestRoutes.get('/get-all/:partyId/:userId', getAllGuestsByPartyId);
