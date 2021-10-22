import express from 'express';
import cors from 'cors';

import { partyRoutes } from './routes/party_routes';
import { guestRoutes } from './routes/guest_routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ test: 'test' });
});

app.use('/party', partyRoutes);
app.use('/guest', guestRoutes);

app.listen(3000, () => {
    console.log(`listening on port ${port}`);
});
