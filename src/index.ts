import express from 'express';
import cors from 'cors';

import { partyRoutes } from './routes/party_routes';
import { guestRoutes } from './routes/guest_routes';
import { activityPackRoutes } from './routes/activity_pack_routes';

export const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ test: 'test' });
});

app.use('/party', partyRoutes);
app.use('/guest', guestRoutes);
app.use('/activity-pack', activityPackRoutes);
