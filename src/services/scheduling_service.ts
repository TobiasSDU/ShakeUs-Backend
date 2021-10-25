import schedule from 'node-schedule';
import { app } from '..';
import { Activity } from './../models/activity';
import { SocketService } from './socket_service';
import { ActivityPackService } from './activity_pack_service';
import { PartyService } from './party_service';

export const scheduleActivity = async (activity: Activity) => {
    const executionTime = new Date(activity.setStartTime);
    const socketService: SocketService = app.get('socketService');
    const activityPack = await ActivityPackService.getActivityPackByActivityId(
        activity.id
    );

    if (activityPack) {
        const party = await PartyService.getPartyByActivityPackId(
            activityPack._id
        );

        if (party) {
            schedule.scheduleJob(executionTime, function () {
                socketService.emitToRoom(
                    'activity-started',
                    {
                        activity: { ...activity },
                        message: 'The activity pack has been deleted',
                    },
                    party._id
                );
            });
        }
    }
};
