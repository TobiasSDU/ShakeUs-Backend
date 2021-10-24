import { req } from '../controllers/endpoint_tests_setup';

export const getTestActivity = async (id: string) => {
    return await req.get('/activity/show').send({
        id: id,
    });
};
