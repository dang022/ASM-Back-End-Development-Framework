import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { connectDB } from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerRouter from './swagger/swagger.js';
import { mountGraphql } from './graphql/index.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.use('/api', routes);
app.use('/api-docs', swaggerRouter);

await connectDB();
await mountGraphql(app);

app.use(errorHandler);

export default app;
