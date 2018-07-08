import jwtMiddleware from 'express-jwt';
import { sign } from 'jsonwebtoken';
import { UserAttributes } from '../model';

const secret = 'super secret';

export const createJwt = (user: UserAttributes): string => sign({
  email: user.email,
}, secret, { expiresIn: '1h', subject: `${user.id}` });

export const createJwtMiddleware = () => {
  return jwtMiddleware({
    secret,
  });
};
