import { Request, Response } from 'express';
import { generateUUID } from '../util/uuid_generator';
import { Activity } from './../models/activity';
import { ActivityService } from './../services/activity_service';

export const createActivity = async (req: Request, res: Response) => {
    const id = generateUUID();
    const title = req.body.title;
    const description = req.body.description;
    const startTime = req.body.startTime;

    if (id && title && description && startTime) {
        const activity = new Activity(id, title, description, startTime);

        const insertResult = await ActivityService.createActivity(activity);

        if (insertResult) {
            return res.json({ activityId: activity.id });
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const showActivity = async (req: Request, res: Response) => {
    const id = req.body.activityId;

    if (id) {
        const activity = await ActivityService.showActivity(id);

        if (activity) {
            return res.json(activity);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const nextActivity = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const userId = req.body.userId;
    const currentTime = Date.now();

    if (partyId && userId) {
        const activity = await ActivityService.getNextActivity(
            partyId,
            userId,
            currentTime
        );

        if (activity) {
            return res.json(activity);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const updateActivityTitle = async (req: Request, res: Response) => {
    const id = req.body.activityId;
    const newTitle = req.body.newTitle;

    if (id && newTitle) {
        const updateResult = await ActivityService.updateActivityTitle(
            id,
            newTitle
        );

        if (updateResult) {
            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const updateActivityDescription = async (
    req: Request,
    res: Response
) => {
    const id = req.body.activityId;
    const newDescription = req.body.newDescription;

    if (id && newDescription) {
        const updateResult = await ActivityService.updateActivityDescription(
            id,
            newDescription
        );

        if (updateResult) {
            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const updateActivityStartTime = async (req: Request, res: Response) => {
    const id = req.body.activityId;
    const newStartTime = req.body.newStartTime;

    if (id && newStartTime) {
        const updateResult = await ActivityService.updateActivityStartTime(
            id,
            newStartTime
        );

        if (updateResult) {
            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};

export const deleteActivity = async (req: Request, res: Response) => {
    const id = req.body.activityId;

    if (id) {
        const deleteResult = await ActivityService.deleteActivity(id);

        if (deleteResult) {
            return res.sendStatus(200);
        }

        return res.sendStatus(400);
    }

    return res.sendStatus(400);
};
