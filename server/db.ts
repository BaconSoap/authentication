import Sequelize from 'sequelize';

export const sequelize = new Sequelize('authentication', '', '', {
  dialect: 'sqlite',
  logging: undefined,
  operatorsAliases: false,
  storage: './authentication.sqlite',
});

export const test = async () => {
  await sequelize.authenticate();
  console.log('connected to sqlite db successfully');
};
