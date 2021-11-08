import { Request, Response } from 'express';
import { GuestService } from '../services/guest_service';

export const showGuest = async (req: Request, res: Response) => {
    const guestId = req.params.guestId;

    if (guestId) {
        const guest = await GuestService.getGuestInfo(guestId);

        if (guest) {
            return res.json(guest);
        }
    }

    return res.sendStatus(400);
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
            return res.sendStatus(200);
        }
    }

    return res.sendStatus(400);
};

export const getAllGuestsByPartyId = async (req: Request, res: Response) => {
    const partyId = req.params.partyId;
    const userId = req.params.userId;

    if (partyId) {
        const guests = await GuestService.getAllGuestsByPartyId(
            partyId,
            userId
        );

        const hosts = await GuestService.getAllHostsByPartyId(partyId, userId);

        if (guests && hosts) {
            const result = {
                guests,
                hosts,
            };
            return res.json(result);
        }
    }

    return res.sendStatus(400);
};
