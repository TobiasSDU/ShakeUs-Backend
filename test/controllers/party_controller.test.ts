import { app } from '../../src/index';
import request from 'supertest';
import { setCurrentDbMode } from '../../config/database_connection';

describe('GET / - a simple api endpoint', () => {
    beforeEach(() => {
        setCurrentDbMode('testFile1');
    });

    it('Hello API Request', async () => {
        const res = await request(app).get('/guest/show').send({
            guestId: 'TestId',
        });

        expect(res.body._name).toEqual('TestUser');
    });

    afterAll(() => {
        setCurrentDbMode('prod');
    });
});
