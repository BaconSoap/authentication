import { Application } from 'express';
import Joi from 'joi';
import Sequelize from 'sequelize';
import { User } from '../model';
import { hashPassword } from '../util/hashPassword';
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
      where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), email.toLowerCase()) as any,
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

