import { Application } from "express";
import { asyncHandler, validationHandler, postValidatedAsync, getAsync } from "./routeUtils";
import { User } from "../model";
import Joi from 'joi';

const passwordErrorCreator = () => ({ message: 'Invalid Password', type: 'string', path: ['password'] });

const userRegistrationSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required().error(passwordErrorCreator),
});

export const registerUsersRoutes = (app: Application) => {
  postValidatedAsync(app, '/api/users', userRegistrationSchema, async (req, res) => {
    const { email, password } = req.body;

    const created = await User.create({
      email,
      password
    });

    res.status(201).send(created);
  });

  getAsync(app, '/api/users/:userId', async (req, res) => {
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
  });
};

