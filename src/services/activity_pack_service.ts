import { Collection, Db } from 'mongodb';
import { app } from '..';
import {
    getDatabase,
    getDbConnectionString,
} from '../../config/database_connection';
import { ActivityPack } from './../models/activity_pack';
import { SocketService } from './socket_service';
import { ActivityService } from './activity_service';
import { PartyService } from './party_service';

export class ActivityPackService {
    public static async createActivityPack(activityPack: ActivityPack) {
        const collection = await this.getActivityPacksCollection();
        const insertResult = await collection.insertOne({ ...activityPack });

        return insertResult.acknowledged;
    }

    public static async showActivityPack(id: string) {
        const collection = await this.getActivityPacksCollection();
        const queryResult = await collection.findOne({ _id: id });

        if (queryResult) {
            const activityPack = new ActivityPack(
                id,
                queryResult.title,
                queryResult.description,
                queryResult.activities
            );

            return activityPack;
        } else {
            return null;
        }
    }

    public static async updateActivityPackTitle(id: string, newTitle: string) {
        const collection = await this.getActivityPacksCollection();
        const updateResult = await collection.updateOne(
            { _id: id },
            { $set: { title: newTitle } }
        );

        if (updateResult.modifiedCount == 1) {
            await this.emitActivityPackUpdated(id);
            return true;
        }

        return false;
    }

    public static async updateActivityPackDescription(
        id: string,
        newDescription: string
    ) {
        const collection = await this.getActivityPacksCollection();
        const updateResult = await collection.updateOne(
            { _id: id },
            { $set: { description: newDescription } }
        );

        if (updateResult.modifiedCount == 1) {
            await this.emitActivityPackUpdated(id);
            return true;
        }

        return false;
    }

    public static async addActivityPackActivity(
        id: string,
        activityId: string
    ) {
        const collection = await this.getActivityPacksCollection();
        const newActivity = await ActivityService.showActivity(activityId);
        const party = await PartyService.getPartyByActivityPackId(id);

        const updateResult = await collection.updateOne(
            { _id: id },
            { $push: { activities: activityId } }
        );

        if (updateResult.modifiedCount == 1) {
            const socketService: SocketService = app.get('socketService');
            if (newActivity && party) {
                socketService.emitToRoom(
                    'activity-added',
                    {
                        ...newActivity,
                        message: newActivity.getTitle + ' has been added',
                    },
                    party._id
                );
            }

            return true;
        }

        return false;
    }

    public static async removeActivityPackActivity(
        id: string,
        activityId: string
    ) {
        const collection = await this.getActivityPacksCollection();
        const removedActivity = await ActivityService.showActivity(activityId);
        const party = await PartyService.getPartyByActivityPackId(id);

        const updateResult = await collection.updateOne(
            { _id: id },
            { $pull: { activities: activityId } }
        );

        if (updateResult.modifiedCount == 1) {
            const socketService: SocketService = app.get('socketService');
            if (removedActivity && party) {
                socketService.emitToRoom(
                    'activity-removed',
                    {
                        ...removedActivity,
                        message:
                            removedActivity.getTitle +
                            ' has been has been removed',
                    },
                    party._id
                );
            }

            return true;
        }

        return false;
    }

    public static async removeAllActivityPackActivities(id: string) {
        const collection = await this.getActivityPacksCollection();
        const party = await PartyService.getPartyByActivityPackId(id);

        const updateResult = await collection.updateOne(
            { _id: id },
            { $set: { activities: [] } }
        );

        if (updateResult.modifiedCount == 1) {
            const socketService: SocketService = app.get('socketService');
            if (party) {
                socketService.emitToRoom(
                    'all-activities-removed',
                    {
                        message: 'All activities have been has been removed',
                    },
                    party._id
                );
            }

            return true;
        }

        return false;
    }

    public static async deleteActivityPack(id: string) {
        const collection = await this.getActivityPacksCollection();
        const deleteResult = await collection.deleteOne({ _id: id });

        return deleteResult.deletedCount == 1;
    }

    public static async getActivityPackByActivityId(activityId: string) {
        const collection = await this.getActivityPacksCollection();

        const queryResult = await collection.findOne({
            activities: activityId,
        });

        const party = await this.getPartyId(activityId);
        const socketService: SocketService = app.get('socketService');

        if (party) {
            socketService.emitToRoom(
                'activity-pack-deleted',
                {
                    removedActivityPackId: activityId,
                    message: 'The activity pack has been deleted',
                },
                party._id
            );
        }

        return queryResult;
    }

    private static async getActivityPacksCollection(): Promise<Collection> {
        const db: Db = await getDatabase(getDbConnectionString());

        return db.collection('activity-packs');
    }

    private static async emitActivityPackUpdated(activityPackId: string) {
        const party = await this.getPartyId(activityPackId);
        const updatedActivityPack = await this.showActivityPack(activityPackId);
        const socketService: SocketService = app.get('socketService');

        if (party) {
            socketService.emitToRoom(
                'activity-pack-updated',
                {
                    updatedActivityPack: { ...updatedActivityPack },
                    message: 'The activity pack has been updated',
                },
                party._id
            );
        }
    }

    private static async getPartyId(activityPackId: string) {
        return await PartyService.getPartyByActivityPackId(activityPackId);
    }
}
