import { Collection, Db } from 'mongodb';
import { app } from '..';
import {
    getDatabase,
    getDbConnectionString,
} from '../../config/database_connection';
import { Activity } from './../models/activity';
import { ActivityPackService } from './activity_pack_service';
import { PartyService } from './party_service';
import { SocketService } from './socket_service';

export class ActivityService {
    public static async createActivity(activity: Activity) {
        const collection = await this.getActivitiesCollection();
        const insertResult = await collection.insertOne({ ...activity });

        return insertResult.acknowledged;
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

    public static async updateActivityTitle(id: string, newTitle: string) {
        const collection = await this.getActivitiesCollection();
        const updateResult = await collection.updateOne(
            { _id: id },
            { $set: { title: newTitle } }
        );

        if (updateResult.modifiedCount == 1) {
            await this.emitActivityUpdated(id);
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
            await this.emitActivityUpdated(id);
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
            await this.emitActivityUpdated(id);
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

    private static async getActivitiesCollection(): Promise<Collection> {
        const db: Db = await getDatabase(getDbConnectionString());

        return db.collection('activities');
    }

    private static async emitActivityUpdated(activityId: string) {
        const party = await this.getPartyId(activityId);
        const updatedActivity = await ActivityService.showActivity(activityId);
        const socketService: SocketService = app.get('socketService');

        if (party) {
            socketService.emitToRoom(
                'activity-updated',
                {
                    updatedActivity: { ...updatedActivity },
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
}
