import { app } from '../../src/index';
import request from 'supertest';
import { getDatabase } from '../../config/database_connection';
import { Db, MongoClient } from 'mongodb';
import { SocketService } from '../../src/services/socket_service';
import http from 'http';

export const req = request(app);

export const dropDatabase = async () => {
    const db: Db = await getDatabase();
    return await db.dropDatabase();
};

export const getCollection = async (collectionName: string) => {
    const db: Db = await getDatabase();
    return db.collection(collectionName);
};

export const connectToTestDb = async (
    dbClient: MongoClient,
    dbName: string
) => {
    if (await dbClient.connect()) {
        const db = await dbClient.db(dbName);
        app.set('database', db);
        const server = await http.createServer(app);
        app.set('socketService', new SocketService(server));
        app.set('server', server);
    } else {
        console.log('Error connection to MongoDB');
    }

    return null;
};

export const closeTestDb = async (dbClient: MongoClient) => {
    await dbClient.close();
    return null;
};
