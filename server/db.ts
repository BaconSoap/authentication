import Sequelize from 'sequelize';

export const sequelize = new Sequelize('authentication', '', '', {
  dialect: 'sqlite',
  storage: './authentication.sqlite',
  operatorsAliases: false,
});

export const test = async () => {
  await sequelize.authenticate();
  console.log('connected to sqlite db successfully');
};
