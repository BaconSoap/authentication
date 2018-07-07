import { Application } from 'express';
import { registerCheckRoutes } from './checkRoutes';
import { registerUsersRoutes } from './users';

export const registerRoutes = (app: Application) => {
  registerCheckRoutes(app);
  registerUsersRoutes(app);
};
