import { app } from './index';

const port = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log(`listening on port ${port}`);
});
