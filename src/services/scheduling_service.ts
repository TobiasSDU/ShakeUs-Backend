import schedule from 'node-schedule';
import { app } from '..';
import { Activity } from './../models/activity';
import { SocketService } from './socket_service';
import { ActivityPackService } from './activity_pack_service';
import { PartyService } from './party_service';

const jobs: Record<string, schedule.Job> = {};

export const scheduleActivity = async (activity: Activity) => {
    const activityId = activity.id;
    const executionTime = new Date(activity.getStartTime);
    const socketService: SocketService = app.get('socketService');

    const activityPack = await ActivityPackService.getActivityPackByActivityId(
        activityId
    );

    if (activityPack) {
        const party = await PartyService.getPartyByActivityPackId(
            activityPack._id
        );

        if (party) {
            jobs[activityId] = schedule.scheduleJob(executionTime, function () {
                socketService.emitToRoom(
                    'activity-started',
                    {
                        activity: { ...activity },
                        message: 'An activity has started!',
                    },
                    party._id
                );
            });
        }
    }
};

export const rescheduleActivity = async (activity: Activity) => {
    const activityId = activity.id;

    if (jobs[activityId]) {
        jobs[activityId].cancel(false);
        delete jobs[activityId];
    }
    await scheduleActivity(activity);
};
