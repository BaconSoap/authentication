import { json } from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { test as testDb } from './db';
import { initAllModels } from './model';
import { registerRoutes } from './routes';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(json());

testDb();
initAllModels();
registerRoutes(app);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err && err.name === 'UnauthorizedError') {
    res.sendStatus(401);
    console.error('failed to parse jwt');
    return;
  }
  next();
});

app.listen(3001, () => console.log('listening'));
