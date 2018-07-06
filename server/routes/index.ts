import { Application } from 'express';
import { registerUsersRoutes } from './users';

export const registerRoutes = (app: Application) => {
  registerUsersRoutes(app);
};
