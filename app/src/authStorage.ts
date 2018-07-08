const storageKey = 'login_jwt';

export const saveToken = (token: string) => localStorage.setItem(storageKey, token);
export const loadToken = () => localStorage.getItem(storageKey);
export const clearToken = () => localStorage.removeItem(storageKey);

export const decodeToken = (encoded: string | null): DecodedJwt | null => {
  if (!encoded) {
    return null;
  }

  const [header, payload] = encoded.split('.');

  if (!header || !payload) {
    return null;
  }

  return {
    header: JSON.parse(atob(header)),
    payload: JSON.parse(atob(payload)),
  } as DecodedJwt;
};

export const isTokenValid = (token: DecodedJwt | null): token is DecodedJwt => {
  if (!token) {
    return false;
  }

  if (token.payload.exp < new Date().getTime() / 1000) {
    return false;
  }

  return true;
};

export type DecodedJwt = {
  header: {
    alg: string;
    typ: 'JWT';
  };
  payload: {
    sub: number;
    email: string;
    iat: number;
    exp: number;
  }
};
