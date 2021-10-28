import { Collection, Db } from 'mongodb';
import { app } from '..';
import {
    getDatabase,
    getDbConnectionString,
} from '../../config/database_connection';
import { Activity } from './../models/activity';
import { ActivityPackService } from './activity_pack_service';
import { PartyService } from './party_service';
import { rescheduleActivity, scheduleActivity } from './scheduling_service';
import { SocketService } from './socket_service';

export class ActivityService {
    public static async createActivity(activity: Activity) {
        const collection = await this.getActivitiesCollection();
        const insertResult = await collection.insertOne({ ...activity });

        if (insertResult.acknowledged) {
            await scheduleActivity(activity);
        }

        return insertResult.acknowledged;
    }

    public static async createManyActivities(activities: Activity[]) {
        const collection = await this.getActivitiesCollection();
        const documents = [];

        for (let i = 0; i < activities.length; i++) {
            documents.push({ ...activities[i] });
        }

        const insertResult = await collection.insertMany(documents);

        if (insertResult.insertedCount == activities.length) {
            for (let i = 0; i < activities.length; i++) {
                await scheduleActivity(activities[i]);
            }

            return true;
        }

        return false;
    }

    public static async showActivity(id: string) {
        const collection = await this.getActivitiesCollection();
        const queryResult = await collection.findOne({ _id: id });

        if (queryResult) {
            const activity = new Activity(
                id,
                queryResult.title,
                queryResult.description,
                queryResult.startTime
            );

            return activity;
        } else {
            return null;
        }
    }

    public static async getNextActivity(
        partyId: string,
        userId: string,
        currentTime: number
    ) {
        const collection = await this.getActivitiesCollection();
        const activityIds = await this.getPartyActivities(partyId, userId);

        if (activityIds) {
            const activities = collection
                .find({
                    $and: [
                        { startTime: { $gt: currentTime } },
                        { _id: { $in: activityIds } },
                    ],
                })
                .sort({ startTime: 1 });

            if (await activities.hasNext()) {
                return activities.next();
            }

            return null;
        }

        return null;
    }

    public static async updateActivityTitle(id: string, newTitle: string) {
        const collection = await this.getActivitiesCollection();
        const updateResult = await collection.updateOne(
            { _id: id },
            { $set: { title: newTitle } }
        );

        if (updateResult.modifiedCount == 1) {
            await this.emitActivityUpdated(id, 'title', newTitle);
            return true;
        }

        return false;
    }

    public static async updateActivityDescription(
        id: string,
        newDescription: string
    ) {
        const collection = await this.getActivitiesCollection();
        const updateResult = await collection.updateOne(
            { _id: id },
            { $set: { description: newDescription } }
        );

        if (updateResult.modifiedCount == 1) {
            await this.emitActivityUpdated(id, 'description', newDescription);
            return true;
        }

        return false;
    }

    public static async updateActivityStartTime(
        id: string,
        newStartTime: string
    ) {
        const collection = await this.getActivitiesCollection();
        const updateResult = await collection.updateOne(
            { _id: id },
            { $set: { startTime: newStartTime } }
        );

        if (updateResult.modifiedCount == 1) {
            const activity = await this.showActivity(id);
            if (activity) {
                await rescheduleActivity(activity);
            }

            await this.emitActivityUpdated(id, 'start-time', newStartTime);
            return true;
        }

        return false;
    }

    public static async deleteActivity(id: string) {
        const collection = await this.getActivitiesCollection();
        const deleteResult = await collection.deleteOne({ _id: id });

        const party = await this.getPartyId(id);
        const socketService: SocketService = app.get('socketService');

        if (party) {
            socketService.emitToRoom(
                'activity-deleted',
                {
                    removedActivityId: id,
                    message: 'The activity has been deleted',
                },
                party._id
            );
        }

        return deleteResult.deletedCount == 1;
    }

    public static async deleteActivities(activityIds: string[]) {
        const collection = await this.getActivitiesCollection();
        const deleteResult = await collection.deleteMany({
            _id: { $in: activityIds },
        });

        return deleteResult.deletedCount == activityIds.length;
    }

    private static async getActivitiesCollection(): Promise<Collection> {
        const db: Db = await getDatabase(getDbConnectionString());

        return db.collection('activities');
    }

    private static async emitActivityUpdated(
        activityId: string,
        updatedField: string,
        updatedValue: string
    ) {
        const party = await this.getPartyId(activityId);
        const updatedActivity = await ActivityService.showActivity(activityId);
        const socketService: SocketService = app.get('socketService');

        if (party) {
            socketService.emitToRoom(
                `activity-${updatedField}-updated`,
                {
                    updatedActivity: { ...updatedActivity },
                    updatedField: updatedValue,
                    message: 'The activity has been updated',
                },
                party._id
            );
        }
    }

    private static async getPartyId(activityId: string) {
        const activityPack =
            await ActivityPackService.getActivityPackByActivityId(activityId);

        if (activityPack) {
            return await PartyService.getPartyByActivityPackId(
                activityPack._id
            );
        }
    }

    private static async getPartyActivities(partyId: string, userId: string) {
        const party = await PartyService.getPartyInfo(partyId, userId);

        if (party) {
            const activityPack = await ActivityPackService.showActivityPack(
                party.getActivityPackId
            );

            if (activityPack) {
                return activityPack.getActivities;
            }
        }

        return null;
    }
}
