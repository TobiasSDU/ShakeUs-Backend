import { Request, Response } from 'express';
import { generateUUID } from '../../util/uuid_generator';
import { Guest } from '../models/guest';
import { Party } from '../models/party';
import { PartyService } from '../services/party_service';

export const createParty = async (req: Request, res: Response) => {
    const partyId = generateUUID();
    const activityPackId = req.body.activityPackId;
    const hostName = req.body.hostName;
    const host = new Guest(generateUUID(), hostName);

    if (partyId && host && activityPackId) {
        const party = new Party(
            partyId,
            [host.id],
            host.id,
            [],
            activityPackId
        );

        const insertResult = await PartyService.createParty(party, host);

        if (insertResult) {
            res.json({ hostId: host.id });
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
};

export const showParty = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const guestId = req.body.guestId;

    if (partyId && guestId) {
        const party = await PartyService.getPartyInfo(partyId, guestId);

        if (party) {
            res.json(party);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
};

export const updateActivityPack = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const activityPackId = req.body.activityPackId;

    if (partyId && activityPackId) {
        const updateResult = await PartyService.updateActivityPack(
            partyId,
            activityPackId
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

export const updatePrimaryHost = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const currentPrimary = req.body.currentPrimary;
    const newPrimary = req.body.newPrimary;

    if (partyId && currentPrimary && newPrimary) {
        const updateResult = await PartyService.updatePrimaryHost(
            partyId,
            currentPrimary,
            newPrimary
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

export const addHost = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const hostId = req.body.hostId;
    const newHostId = req.body.newHostId;

    if (partyId && hostId && newHostId) {
        const updateResult = await PartyService.addNewHost(
            partyId,
            hostId,
            newHostId
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

export const removeHost = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const primaryHostId = req.body.primaryHostId;
    const removedHostId = req.body.removedHostId;

    if (partyId && primaryHostId && removedHostId) {
        if (primaryHostId == removedHostId) {
            res.sendStatus(403);
        }

        const updateResult = await PartyService.removeHost(
            partyId,
            primaryHostId,
            removedHostId
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

export const removeGuest = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const hostId = req.body.hostId;
    const removedGuestId = req.body.removedGuestId;

    if (partyId && hostId && removedGuestId) {
        const updateResult = await PartyService.removeGuest(
            partyId,
            hostId,
            removedGuestId
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

export const joinParty = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const guestName = req.body.guestName;

    if (partyId && guestName) {
        const newGuest = new Guest(generateUUID(), guestName);
        const updateResult = await PartyService.joinParty(partyId, newGuest);

        if (updateResult) {
            res.json(newGuest);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
};

export const leaveParty = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const userId = req.body.userId;

    if (partyId && userId) {
        const updateResult = await PartyService.leaveParty(partyId, userId);

        if (updateResult > 0) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
};

export const deleteParty = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const primaryHostId = req.body.primaryHostId;

    if (partyId && primaryHostId) {
        const deleteResult = await PartyService.deleteParty(
            partyId,
            primaryHostId
        );

        if (deleteResult) {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
};
