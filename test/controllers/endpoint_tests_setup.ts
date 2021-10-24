import { app } from '../../src/index';
import request from 'supertest';
import {
    getDatabase,
    getDbConnectionString,
} from '../../config/database_connection';
import { Db } from 'mongodb';

export const req = request(app);

export const dropDatabase = async () => {
    const db: Db = await getDatabase(getDbConnectionString());
    return await db.dropDatabase();
};

export const getCollection = async (collectionName: string) => {
    const db: Db = await getDatabase(getDbConnectionString());
    return db.collection(collectionName);
};
