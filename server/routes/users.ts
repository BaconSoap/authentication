import { Application } from "express";
import { asyncHandler, validationHandler } from "./routeUtils";
import { User } from "../model";
import Joi from 'joi';

const userRegistrationSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
});

export const registerUsersRoutes = (app: Application) => {
  app.post('/api/users', validationHandler(userRegistrationSchema, asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const created = await User.create({
      email,
      password
    });

    res.status(201).send(created);
  })));

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

