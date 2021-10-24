import { Collection, Db } from 'mongodb';
import {
    getDatabase,
    getDbConnectionString,
} from '../../config/database_connection';
import { ActivityPack } from './../models/activity_pack';

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
                queryResult._title,
                queryResult._description,
                queryResult._activities
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
            { $set: { _title: newTitle } }
        );

        if (updateResult.modifiedCount == 1) {
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
            { $set: { _description: newDescription } }
        );

        if (updateResult.modifiedCount == 1) {
            return true;
        }

        return false;
    }

    public static async addActivityPackActivity(
        id: string,
        activityId: string
    ) {
        const collection = await this.getActivityPacksCollection();
        const updateResult = await collection.updateOne(
            { _id: id },
            { $push: { _activities: activityId } }
        );

        if (updateResult.modifiedCount == 1) {
            return true;
        }

        return false;
    }

    public static async removeActivityPackActivity(
        id: string,
        activityId: string
    ) {
        const collection = await this.getActivityPacksCollection();
        const updateResult = await collection.updateOne(
            { _id: id },
            { $pull: { _activities: activityId } }
        );

        if (updateResult.modifiedCount == 1) {
            return true;
        }

        return false;
    }

    public static async removeAllActivityPackActivities(id: string) {
        const collection = await this.getActivityPacksCollection();
        const updateResult = await collection.updateOne(
            { _id: id },
            { $set: { _activities: [] } }
        );

        if (updateResult.modifiedCount == 1) {
            return true;
        }

        return false;
    }

    public static async deleteActivityPack(id: string) {
        const collection = await this.getActivityPacksCollection();
        const deleteResult = await collection.deleteOne({ _id: id });

        return deleteResult.deletedCount == 1;
    }

    private static async getActivityPacksCollection(): Promise<Collection> {
        const db: Db = await getDatabase(getDbConnectionString());

        return db.collection('activity-packs');
    }
}
