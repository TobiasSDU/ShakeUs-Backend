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

export const updateActivityPack = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const activityPackId = req.body.activityPackId;

    const updateResult = await PartyService.updateActivityPack(
        partyId,
        activityPackId
    );

    if (updateResult) {
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
};

export const updatePrimaryHost = async (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const addHost = async (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const removeHost = async (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const removeGuest = async (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const joinParty = async (req: Request, res: Response) => {
    res.sendStatus(200);
};

export const leaveParty = async (req: Request, res: Response) => {
    res.sendStatus(200);
};
