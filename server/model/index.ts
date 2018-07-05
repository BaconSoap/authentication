import { initUsers } from './User';
export { User } from './User';

export const initAllModels = async () => {
  await initUsers();
  console.log('initialized all models');
}
