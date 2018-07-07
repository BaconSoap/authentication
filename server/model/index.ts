import { initUsers } from './User';
export { UserAttributes, UserInstance, User } from './User';

export const initAllModels = async () => {
  await initUsers();
  console.log('initialized all models');
};
