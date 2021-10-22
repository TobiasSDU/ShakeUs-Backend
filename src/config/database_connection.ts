import { MongoClient, Db } from 'mongodb';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            SHAKE_US_MONGO_URI: string;
            SHAKE_US_MONGO_TEST_URI: string;
        }
    }
}

type DbMode = 'test' | 'prod';

export function getDbConnectionString(dbMode: DbMode) {
    if (dbMode == 'prod') {
        return process.env.SHAKE_US_MONGO_URI;
    }

    return process.env.SHAKE_US_MONGO_TEST_URI;
}

export async function getDatabase(connectionString: string): Promise<Db> {
    const client: MongoClient = new MongoClient(connectionString);
    await client.connect();

    return client.db('shake-us');
}
