import express from 'express';
import { test as testDb } from './db';
import { initAllModels } from './model';
import { registerRoutes } from './routes';

const app = express();

app.get('/', (req, res) => {
  res.send('hi');
});

testDb();
initAllModels();
registerRoutes(app);

app.listen(3001, () => console.log('listening'));
