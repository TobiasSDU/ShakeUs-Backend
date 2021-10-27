import { req } from '../controllers/endpoint_tests_setup';

export const getActivityPack = async (id: string) => {
    return await req.get('/activity-pack').send({
        activityPackId: id,
    });
};
