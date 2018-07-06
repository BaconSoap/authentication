import express from 'express';
import { test as testDb } from './db';
import { initAllModels } from './model';
import { registerRoutes } from './routes';
import cors from 'cors';
import { json } from 'body-parser';

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(json());

app.get('/', (req, res) => {
  res.send('hi');
});

testDb();
initAllModels();
registerRoutes(app);

app.listen(3001, () => console.log('listening'));
