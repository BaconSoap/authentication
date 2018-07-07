import { Application } from 'express';
import Joi from 'joi';
import Sequelize from 'sequelize';
import { User } from '../model';
import { whereByEmail } from '../model/User';
import { compareUsers, hashPassword } from '../util/hashPassword';
import { createJwt } from '../util/jwtHelpers';
import { getAsync, postValidatedAsync } from './routeUtils';

const passwordErrorCreator = () => ({ message: 'Invalid password', type: 'string', path: ['password'] });

const userRegistrationSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required().error(passwordErrorCreator),
});

export const registerUsersRoutes = (app: Application) => {
  postValidatedAsync(app, '/api/users', userRegistrationSchema, async (req, res) => {
    const { email, password } = req.body;

    const countUsersWithEmail = await User.count({
      where: whereByEmail(email) as any,
    });

    if (countUsersWithEmail > 0) {
      res.status(400).send({ isValidationError: true, details: [{ message: 'User with same email already exists' }] });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const created = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).send(created);
  });

  postValidatedAsync(app, '/api/users/login', userRegistrationSchema, async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      where: whereByEmail(email),
    });

    // hash of ' ', which can't be supplied by a real user
    const fakeHash = '$2b$10$R7KQwzIA265h8lYcTkZau.P2ONRQ3zlIMPGK30wbzuwNX26oW09gG';
    const existingPassword = existingUser ? existingUser.password : fakeHash;

    const isValid = await compareUsers(existingPassword, password);

    if (!isValid || !existingUser) {
      res.status(404).send({ isValidationError: false, message: 'Invalid email or password' });
      return;
    }

    res.status(201).send({ jwt: createJwt(existingUser.get()) });
  });


  getAsync(app, '/api/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    if (isNaN(parseInt(userId, 10))) {
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

