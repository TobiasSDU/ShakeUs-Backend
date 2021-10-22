import { MongoClient, Db } from 'mongodb';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            SHAKE_US_MONGO_URI: string;
            SHAKE_US_MONGO_TEST1_URI: string;
            SHAKE_US_MONGO_TEST2_URI: string;
            SHAKE_US_MONGO_TEST3_URI: string;
            SHAKE_US_MONGO_TEST4_URI: string;
        }
    }
}

type DbMode = 'prod' | 'testFile1' | 'testFile2' | 'testFile3' | 'testFile4';

let currentDbMode: DbMode;

export const getCurrentDbMode = () => {
    if (!currentDbMode) {
        currentDbMode = 'prod';
    }

    return currentDbMode;
};

export const setCurrentDbMode = (dbMode: DbMode) => {
    currentDbMode = dbMode;
};

export const getDbConnectionString = (dbMode: DbMode) => {
    let connectionString;

    switch (dbMode) {
        case 'prod':
            connectionString = process.env.SHAKE_US_MONGO_URI;
            break;
        case 'testFile1':
            connectionString = process.env.SHAKE_US_MONGO_TEST1_URI;
            break;
        case 'testFile2':
            connectionString = process.env.SHAKE_US_MONGO_TEST2_URI;
            break;
        case 'testFile3':
            connectionString = process.env.SHAKE_US_MONGO_TEST3_URI;
            break;
        case 'testFile4':
            connectionString = process.env.SHAKE_US_MONGO_TEST4_URI;
            break;
    }

    return connectionString;
};

export const getDatabase = async (connectionString: string): Promise<Db> => {
    const client = new MongoClient(connectionString);
    await client.connect();

    return client.db();
};
