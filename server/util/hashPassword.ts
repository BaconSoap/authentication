import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

export const compareUsers = async (dbPassword: string, suppliedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(suppliedPassword, dbPassword);
};
