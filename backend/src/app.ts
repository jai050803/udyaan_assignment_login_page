import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// TODO: mount routes at /api, e.g. app.use('/api', routesIndex);

app.use(errorHandler);

export default app;
