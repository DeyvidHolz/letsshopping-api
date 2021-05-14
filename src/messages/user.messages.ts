import { Messages } from '../types/messages/message.types';

const userMessages: Messages = {
  created: 'User created.',
  updated: 'User updated.',
  deleted: 'User deleted.',
  invalidData: 'Invalid data.',
  invalidEmail: 'Invalid email.',
  invalidCredentials: 'Invalid username or password.',
  invalidPassword: 'Password incorrect.',
  alreadyExists: 'This username or email is already in use.',
  alreadyDeleted: 'Invalid token or user already deleted.',

  searchByEmailNotFound: {
    msg: 'User with email {email} not found.',
    replace: ['email'],
  },
  searchByIDNotFound: {
    msg: 'User with ID {id} not found.',
    replace: ['id'],
  },
};

export default userMessages;
