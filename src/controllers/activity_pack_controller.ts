import { Request, Response } from "express";
import { defaultActivityPacks } from "../templates/default_activity_packs";
import { generateUUID } from "../util/uuid_generator";
import { ActivityPack } from "./../models/activity_pack";
import { ActivityPackService } from "./../services/activity_pack_service";

export const createActivityPack = async (req: Request, res: Response) => {
  const activityPackId = generateUUID();
  const title = req.body.title;
  const description = req.body.description;

  if (title && description) {
    const activityPack = new ActivityPack(
      activityPackId,
      title,
      description,
      []
    );

    const insertResult = await ActivityPackService.createActivityPack(
      activityPack
    );

    if (insertResult) {
      return res.json({ activityPackId: activityPackId });
    }
  }

  return res.sendStatus(400);
};

export const showActivityPack = async (req: Request, res: Response) => {
  const activityPackId = req.params.activityPackId;

  if (activityPackId) {
    const activityPack = await ActivityPackService.showActivityPack(
      activityPackId
    );

    if (activityPack) {
      return res.json(activityPack);
    }
  }

  return res.sendStatus(400);
};

export const getActivityPackTemplates = async (req: Request, res: Response) => {
  if (defaultActivityPacks) {
    return res.json(defaultActivityPacks);
  }

  return res.sendStatus(404);
};

export const updateActivityPack = async (req: Request, res: Response) => {
  const activityPackId = req.body.activityPackId;
  const newTitle = req.body.newTitle;
  const newDescription = req.body.newDescription;
  const resultArray: boolean[] = [];

  if (activityPackId) {
    if (newTitle) {
      resultArray.push(await updateActivityPackTitle(activityPackId, newTitle));
    }

    if (newDescription) {
      resultArray.push(
        await updateActivityPackDescription(activityPackId, newDescription)
      );
    }

    if (!resultArray.includes(false)) {
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(400);
};

const updateActivityPackTitle = async (
  activityPackId: string,
  newTitle: string
) => {
  if (activityPackId && newTitle) {
    const updateResult = await ActivityPackService.updateActivityPackTitle(
      activityPackId,
      newTitle
    );

    if (updateResult) {
      return true;
    }
  }

  return false;
};

const updateActivityPackDescription = async (
  activityPackId: string,
  newDescription: string
) => {
  if (activityPackId && newDescription) {
    const updateResult =
      await ActivityPackService.updateActivityPackDescription(
        activityPackId,
        newDescription
      );

    if (updateResult) {
      return true;
    }
  }

  return false;
};

export const addActivityPackActivity = async (req: Request, res: Response) => {
  const activityPackId = req.body.activityPackId;
  const activityId = req.body.activityId;

  if (activityPackId && activityId) {
    const updateResult = await ActivityPackService.addActivityPackActivity(
      activityPackId,
      activityId
    );

    if (updateResult) {
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(400);
};

export const removeActivityPackActivity = async (
  req: Request,
  res: Response
) => {
  const activityPackId = req.body.activityPackId;
  const activityId = req.body.activityId;

  if (activityPackId && activityId) {
    const updateResult = await ActivityPackService.removeActivityPackActivity(
      activityPackId,
      activityId
    );

    if (updateResult) {
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(400);
};

export const removeAllActivityPackActivities = async (
  req: Request,
  res: Response
) => {
  const activityPackId = req.body.activityPackId;

  if (activityPackId) {
    const updateResult =
      await ActivityPackService.removeAllActivityPackActivities(activityPackId);

    if (updateResult) {
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(400);
};

export const deleteActivityPack = async (req: Request, res: Response) => {
  const activityPackId = req.body.activityPackId;

  if (activityPackId) {
    const updateResult = await ActivityPackService.deleteActivityPack(
      activityPackId
    );

    if (updateResult) {
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(400);
};
