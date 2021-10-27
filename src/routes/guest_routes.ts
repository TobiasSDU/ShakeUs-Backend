import express from 'express';
import { showGuest, updateGuestName } from '../controllers/guest_controller';

export const guestRoutes = express.Router();

guestRoutes.get('', showGuest);
guestRoutes.patch('', updateGuestName);
