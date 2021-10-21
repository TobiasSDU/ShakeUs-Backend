import { MongoClient, Db } from 'mongodb';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            SHAKE_US_MONGO_URI: string;
        }
    }
}

export async function getDatabase(): Promise<Db> {
    const client: MongoClient = new MongoClient(process.env.SHAKE_US_MONGO_URI);
    await client.connect();

    return client.db('shake-us');
}
