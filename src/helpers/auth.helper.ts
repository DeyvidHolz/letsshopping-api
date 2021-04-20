import decode from 'jwt-decode';

const getUserData = (authorizationHeader: string) => {
  let user = null;

  try {
    user = decode(authorizationHeader);
    return user;
  } catch (err) {
    return null;
  }
};

export { getUserData };
