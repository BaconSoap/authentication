import Sequelize from 'sequelize';
import { sequelize } from '../db';

export type User = { email: string; password: string; };
export const User = sequelize.define<User, User>('User', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
});

export const initUsers = async () => {
  await User.sync();
};
