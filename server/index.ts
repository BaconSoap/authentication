import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { test as testDb } from './db';
import { initAllModels } from './model';
import { registerRoutes } from './routes';

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(json());

testDb();
initAllModels();
registerRoutes(app);

app.listen(3001, () => console.log('listening'));
