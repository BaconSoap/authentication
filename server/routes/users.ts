import { Application } from "express";
import { asyncHandler } from "./routeUtils";
import { User } from "../model";

export const registerUsersRoutes = (app: Application) => {
  app.post('/api/users', (req, res) => {

  });

  app.get('/api/users/:userId', asyncHandler(async (req, res) => {
    const userId = req.params['userId'];
    if (isNaN(parseInt(userId))) {
      res.sendStatus(400);
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.sendStatus(404);
      return;
    }

    res.send(user);
  }));
};
