import schedule from 'node-schedule';
import { app } from '..';
import { Activity } from './../models/activity';
import { SocketService } from './socket_service';
import { ActivityPackService } from './activity_pack_service';
import { PartyService } from './party_service';
import { GuestService } from './guest_service';
import axios from 'axios';

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

                sendExpoPushNotification(activity, party._id);
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

const sendExpoPushNotification = async (
    activity: Activity,
    partyId: string
) => {
    console.log('EXPO TOKENS:', await getExpoPushTokens(partyId));
    const message = {
        to: await getExpoPushTokens(partyId),
        sound: 'default',
        title: activity.getTitle,
        body: activity.getDescription,
        data: {
            activity: activity,
        },
    };

    await axios.post('https://exp.host/--/api/v2/push/send', {
        ...message,
    });
};

const getExpoPushTokens = async (partyId: string) => {
    const party = await PartyService.getPartyInfoWithoutAuth(partyId);
    const expoTokens: string[] = [];

    if (party) {
        const hosts = await GuestService.getHostsByPartyId(
            partyId,
            party.getPrimaryHost
        );

        if (hosts) {
            hosts.map((host) => expoTokens.push(host.getNotificationToken));
        }

        const guests = await GuestService.getGuestsByPartyId(
            partyId,
            party.getPrimaryHost
        );

        if (guests) {
            guests.map((guest) => expoTokens.push(guest.getNotificationToken));
        }
    }

    return expoTokens;
};
