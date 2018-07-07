import { Application } from 'express';
import { sequelize } from '../db';
import { getAsync } from './routeUtils';

export const registerCheckRoutes = (app: Application) => {
  getAsync(app, `/api/healthCheck`, async (req, res) => {
    const dbResponse = await sequelize.query('SELECT 1', { plain: true });
    res.send({
      db: dbResponse[1] ? 'successful' : 'failed',
      routing: 'successful',
    });
  });
};
