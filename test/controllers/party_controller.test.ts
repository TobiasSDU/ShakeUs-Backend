import { app } from '../../src/index';
import request from 'supertest';
import { Db } from 'mongodb';
import {
    getDatabase,
    getDbConnectionString,
} from '../../config/database_connection';

describe('GET / - a simple api endpoint', () => {
    beforeAll(async () => {
        const db: Db = await getDatabase(getDbConnectionString('testFile1'));
    });

    it('Hello API Request', async () => {
        const res = await request(app).get('/');

        expect(res.body.test).toEqual('test');
        expect(res.statusCode).toEqual(200);
    });
});
