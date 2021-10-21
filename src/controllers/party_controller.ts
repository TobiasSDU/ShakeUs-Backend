import { Request, Response } from 'express';
import { generateUUID } from '../../util/uuid_generator';
import { Party } from '../models/party';
import { PartyService } from './../services/party.service';

export const createParty = async (req: Request, res: Response) => {
    const partyId = generateUUID();
    const hostId = generateUUID();
    const activityPackId = generateUUID(); /* TODO: Get from request body */

    const party = new Party(partyId, [hostId], hostId, [], activityPackId);

    const insertResult = await PartyService.createParty(party);

    if (insertResult) {
        res.json({ hostId: hostId });
    } else {
        res.sendStatus(500);
    }
};

export const showParty = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const guestId = req.body.guestId;

    const party = await PartyService.getPartyInfo(partyId, guestId);

    if (party) {
        res.json(party);
    } else {
        res.sendStatus(500);
    }
};

export const updateParty = (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const addHost = (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const removeHost = (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const removeGuest = (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const joinParty = (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const leaveParty = (req: Request, res: Response) => {
    res.sendStatus(200);
};
