import express from 'express';
import cors from 'cors';

import { partyRoutes } from './routes/party_routes';
import { guestRoutes } from './routes/guest_routes';
import { activityPackRoutes } from './routes/activity_pack_routes';
import { activityRoutes } from './routes/activity_routes';
import path from 'path';

export const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../dummy-client/')));

app.use('/party', partyRoutes);
app.use('/guest', guestRoutes);
app.use('/activity-pack', activityPackRoutes);
app.use('/activity', activityRoutes);
