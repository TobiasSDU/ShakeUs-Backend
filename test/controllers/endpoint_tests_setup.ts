import { app } from '../../src/index';
import request from 'supertest';
import {
    getCurrentDbMode,
    getDatabase,
    getDbConnectionString,
} from '../../config/database_connection';
import { Db } from 'mongodb';

export const req = request(app);

export const dropDatabase = async () => {
    const db: Db = await getDatabase(getDbConnectionString(getCurrentDbMode()));
    return await db.dropDatabase();
};

export const getCollection = async (collectionName: string) => {
    const db: Db = await getDatabase(getDbConnectionString(getCurrentDbMode()));
    return db.collection(collectionName);
};
