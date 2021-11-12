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
    }

    return res.sendStatus(400);
};

export const showActivity = async (req: Request, res: Response) => {
    const id = req.params.activityId;

    if (id) {
        const activity = await ActivityService.showActivity(id);

        if (activity) {
            return res.json(activity);
        }
    }

    return res.sendStatus(400);
};

export const nextActivity = async (req: Request, res: Response) => {
    const partyId = req.params.partyId;
    const userId = req.params.userId;
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
    }

    return res.sendStatus(400);
};

export const getAllActivitiesByActivityPackId = async (
    req: Request,
    res: Response
) => {
    const activityPackId = req.params.activityPackId;

    if (activityPackId) {
        const activities = await ActivityService.getActivitiesByActivityPackId(
            activityPackId
        );

        if (activities) {
            return res.json(activities);
        }
    }

    return res.sendStatus(400);
};

export const updateActivity = async (req: Request, res: Response) => {
    const id = req.body.activityId;
    const newTitle = req.body.newTitle;
    const newDescription = req.body.newDescription;
    const newStartTime = req.body.newStartTime;
    const resultArray: boolean[] = [];

    if (id) {
        if (newTitle) {
            resultArray.push(await updateActivityTitle(id, newTitle));
        }

        if (newDescription) {
            resultArray.push(
                await updateActivityDescription(id, newDescription)
            );
        }

        if (newStartTime) {
            resultArray.push(await updateActivityStartTime(id, newStartTime));
        }

        if (!resultArray.includes(false)) {
            return res.sendStatus(200);
        }
    }

    return res.sendStatus(400);
};

const updateActivityTitle = async (id: string, newTitle: string) => {
    if (id && newTitle) {
        const updateResult = await ActivityService.updateActivityTitle(
            id,
            newTitle
        );

        if (updateResult) {
            return true;
        }
    }

    return false;
};

const updateActivityDescription = async (
    id: string,
    newDescription: string
) => {
    if (id && newDescription) {
        const updateResult = await ActivityService.updateActivityDescription(
            id,
            newDescription
        );

        if (updateResult) {
            return true;
        }
    }

    return false;
};

const updateActivityStartTime = async (id: string, newStartTime: number) => {
    if (id && newStartTime) {
        const updateResult = await ActivityService.updateActivityStartTime(
            id,
            newStartTime
        );

        if (updateResult) {
            return true;
        }
    }

    return false;
};

export const deleteActivity = async (req: Request, res: Response) => {
    const id = req.body.activityId;

    if (id) {
        const deleteResult = await ActivityService.deleteActivity(id);

        if (deleteResult) {
            return res.sendStatus(200);
        }
    }

    return res.sendStatus(400);
};

export const postponeActivities = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const hostId = req.body.hostId;
    const delay = req.body.delay;

    if (partyId && hostId && delay) {
        const updateResult = await ActivityService.postponeActivities(
            partyId,
            hostId,
            delay
        );

        if (updateResult) {
            return res.sendStatus(200);
        }
    }

    return res.sendStatus(400);
};

export const postponeActivity = async (req: Request, res: Response) => {
    const partyId = req.body.partyId;
    const hostId = req.body.hostId;
    const activityId = req.body.activityId;
    const delay = req.body.delay;

    if (partyId && hostId && activityId && delay) {
        const updateResult = await ActivityService.postponeActivity(
            partyId,
            hostId,
            activityId,
            delay
        );

        if (updateResult) {
            return res.sendStatus(200);
        }
    }

    return res.sendStatus(400);
};
