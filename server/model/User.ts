import Sequelize from 'sequelize';
import { sequelize } from '../db';

export type UserAttributes = { email: string; password: string; id?: number };
export type UserInstance = Sequelize.Instance<UserAttributes> & UserAttributes;
export const User = sequelize.define<UserInstance, UserAttributes>('User', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
});

export const initUsers = async () => {
  await User.sync();
};

export const whereByEmail = (email: string) => Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), email.toLowerCase());
