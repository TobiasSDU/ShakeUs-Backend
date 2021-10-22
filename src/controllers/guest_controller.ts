import { Request, Response } from 'express';
import { GuestService } from '../services/guest_service';

export const showGuest = async (req: Request, res: Response) => {
    const guestId = req.body.guestId;

    if (guestId) {
        const guest = await GuestService.getGuestInfo(guestId);

        if (guest) {
            res.json(guest);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
};

export const updateGuestName = async (req: Request, res: Response) => {
    const guestId = req.body.guestId;
    const newName = req.body.newName;

    if (guestId && newName) {
        const updateResult = await GuestService.updateGuestName(
            guestId,
            newName
        );

        if (updateResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
};
