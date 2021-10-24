import { Collection, Db } from 'mongodb';
import {
    getDatabase,
    getDbConnectionString,
} from '../../config/database_connection';
import { Activity } from './../models/activity';

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
                queryResult._title,
                queryResult._description,
                queryResult._startTime
            );

            return activity;
        } else {
            return null;
        }
    }

    public static async updateActivityPackTitle(id: string, newTitle: string) {
        const collection = await this.getActivitiesCollection();
        const updateResult = await collection.updateOne(
            { _id: id },
            { $set: { _title: newTitle } }
        );

        if (updateResult.modifiedCount == 1) {
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
            { $set: { _description: newDescription } }
        );

        if (updateResult.modifiedCount == 1) {
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
            { $set: { _startTime: newStartTime } }
        );

        if (updateResult.modifiedCount == 1) {
            return true;
        }

        return false;
    }

    public static async deleteActivity(id: string) {
        const collection = await this.getActivitiesCollection();
        const deleteResult = await collection.deleteOne({ _id: id });

        return deleteResult.deletedCount == 1;
    }

    private static async getActivitiesCollection(): Promise<Collection> {
        const db: Db = await getDatabase(getDbConnectionString());

        return db.collection('activities');
    }
}
