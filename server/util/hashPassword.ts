import bcrypt from 'bcrypt';

// this is bad
const salt = 'why so salty';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, salt);
};
