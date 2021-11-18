import { Request, Response } from "express";
import { generateUUID } from "../util/uuid_generator";
import { Guest } from "../models/guest";
import { Party } from "../models/party";
import { PartyService } from "../services/party_service";
import { generatePartyId } from "../util/party_id_generator";
import { GuestService } from "./../services/guest_service";

export const createParty = async (req: Request, res: Response) => {
  const partyId = generatePartyId();
  const activityPackId = req.body.activityPackId;
  const hostName = req.body.hostName;
  const hostNotificationToken = req.body.hostNotificationToken;
  const startTime = req.body.startTime;
  const host = new Guest(generateUUID(), hostName, hostNotificationToken);

  if (partyId && host && activityPackId && hostNotificationToken && startTime) {
    const party = new Party(partyId, [host.id], host.id, [], activityPackId);

    const insertResult = await PartyService.createParty(party, host, startTime);

    if (insertResult) {
      return res.json({
        hostId: host.id,
        partyId: partyId,
        hostNotificationToken: hostNotificationToken,
      });
    }
  }

  return res.sendStatus(400);
};

export const showParty = async (req: Request, res: Response) => {
  const partyId = req.params.partyId;
  const guestId = req.params.guestId;

  if (partyId && guestId) {
    const party = await PartyService.getPartyInfo(partyId, guestId);

    if (party) {
      return res.json(party);
    }
  }

  return res.sendStatus(400);
};

export const updateParty = async (req: Request, res: Response) => {
  const partyId = req.body.partyId;
  const primaryHostId = req.body.primaryHostId;
  const newActivityPackId = req.body.newActivityPackId;
  const newPrimary = req.body.newPrimary;
  const resultsArray: boolean[] = [];

  if (partyId && primaryHostId) {
    if (newActivityPackId) {
      resultsArray.push(
        await updateActivityPack(partyId, primaryHostId, newActivityPackId)
      );
    }

    if (newPrimary) {
      resultsArray.push(
        await updatePrimaryHost(partyId, primaryHostId, newPrimary)
      );
    }

    if (!resultsArray.includes(false)) {
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(400);
};

const updateActivityPack = async (
  partyId: string,
  primaryHostId: string,
  newActivityPackId: string
) => {
  if (partyId && primaryHostId && newActivityPackId) {
    const updateResult = await PartyService.updateActivityPack(
      partyId,
      primaryHostId,
      newActivityPackId
    );

    if (updateResult) {
      return true;
    }
  }

  return false;
};

const updatePrimaryHost = async (
  partyId: string,
  currentPrimary: string,
  newPrimary: string
) => {
  if (partyId && currentPrimary && newPrimary) {
    const updateResult = await PartyService.updatePrimaryHost(
      partyId,
      currentPrimary,
      newPrimary
    );

    if (updateResult) {
      return true;
    }
  }

  return false;
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
      return res.sendStatus(200);
    }

    return res.sendStatus(400);
  }

  return res.sendStatus(400);
};

export const removeHost = async (req: Request, res: Response) => {
  const partyId = req.body.partyId;
  const primaryHostId = req.body.primaryHostId;
  const removedHostId = req.body.removedHostId;

  if (partyId && primaryHostId && removedHostId) {
    if (primaryHostId == removedHostId) {
      return res.sendStatus(403);
    }

    const updateResult = await PartyService.removeHost(
      partyId,
      primaryHostId,
      removedHostId
    );

    if (updateResult) {
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(400);
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
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(400);
};

export const joinParty = async (req: Request, res: Response) => {
  const partyId = req.body.partyId;
  const guestName = req.body.guestName;
  const guestNotificationToken = req.body.guestNotificationToken;

  if (partyId && guestName && guestNotificationToken) {
    const newGuest = new Guest(
      generateUUID(),
      guestName,
      guestNotificationToken
    );
    const updateResult = await PartyService.joinParty(partyId, newGuest);

    if (updateResult) {
      const responseValue = {
        newGuest: newGuest,
        guests: await GuestService.getGuestsByPartyId(partyId, newGuest.id),
        hosts: await GuestService.getHostsByPartyId(partyId, newGuest.id),
        primaryHost: await GuestService.getPrimaryHostByPartyId(
          partyId,
          newGuest.id
        ),
      };
      return res.json(responseValue);
    }
  }

  return res.sendStatus(400);
};

export const leaveParty = async (req: Request, res: Response) => {
  const partyId = req.body.partyId;
  const userId = req.body.userId;

  if (partyId && userId) {
    const updateResult = await PartyService.leaveParty(partyId, userId);

    if (updateResult > 0) {
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(400);
};

export const deleteParty = async (req: Request, res: Response) => {
  const partyId = req.body.partyId;
  const primaryHostId = req.body.primaryHostId;

  if (partyId && primaryHostId) {
    const deleteResult = await PartyService.deleteParty(partyId, primaryHostId);

    if (deleteResult) {
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(400);
};
