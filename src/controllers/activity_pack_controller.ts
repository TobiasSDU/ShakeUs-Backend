import { Request, Response } from 'express';
import { generateUUID } from '../util/uuid_generator';
import { ActivityPack } from './../models/activity_pack';
import { ActivityPackService } from './../services/activity_pack_service';

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
            return res.json({ id: activityPackId });
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const showActivityPack = async (req: Request, res: Response) => {
    const activityPackId = req.body.id;

    if (activityPackId) {
        const activityPack = await ActivityPackService.showActivityPack(
            activityPackId
        );

        if (activityPack) {
            return res.json(activityPack);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const updateActivityPackTitle = async (req: Request, res: Response) => {
    const activityPackId = req.body.id;
    const newTitle = req.body.newTitle;

    if (activityPackId && newTitle) {
        const updateResult = await ActivityPackService.updateActivityPackTitle(
            activityPackId,
            newTitle
        );

        if (updateResult) {
            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const updateActivityPackDescription = async (
    req: Request,
    res: Response
) => {
    const activityPackId = req.body.id;
    const newDescription = req.body.newDescription;

    if (activityPackId && newDescription) {
        const updateResult =
            await ActivityPackService.updateActivityPackDescription(
                activityPackId,
                newDescription
            );

        if (updateResult) {
            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const addActivityPackActivity = async (req: Request, res: Response) => {
    const activityPackId = req.body.id;
    const activityId = req.body.activityId;

    if (activityPackId && activityId) {
        const updateResult = await ActivityPackService.addActivityPackActivity(
            activityPackId,
            activityId
        );

        if (updateResult) {
            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const removeActivityPackActivity = async (
    req: Request,
    res: Response
) => {
    const activityPackId = req.body.id;
    const activityId = req.body.activityId;

    if (activityPackId && activityId) {
        const updateResult =
            await ActivityPackService.removeActivityPackActivity(
                activityPackId,
                activityId
            );

        if (updateResult) {
            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const removeAllActivityPackActivities = async (
    req: Request,
    res: Response
) => {
    const activityPackId = req.body.id;

    if (activityPackId) {
        const updateResult =
            await ActivityPackService.removeAllActivityPackActivities(
                activityPackId
            );

        if (updateResult) {
            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const deleteActivityPack = async (req: Request, res: Response) => {
    const activityPackId = req.body.id;

    if (activityPackId) {
        const updateResult = await ActivityPackService.deleteActivityPack(
            activityPackId
        );

        if (updateResult) {
            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};
