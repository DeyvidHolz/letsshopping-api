import decode from 'jwt-decode';

import { User } from '../entity/User';

const getUserData = (authorizationHeader: string): User | null => {
  let user: User;

  try {
    user = decode(authorizationHeader) as User;
    return user;
  } catch (err) {
    return null;
  }
};

export { getUserData };
