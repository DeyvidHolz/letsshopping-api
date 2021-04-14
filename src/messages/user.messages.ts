import { messages } from '../types/messages/message.types';

const userMessages: messages = {
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
    replace: [{ from: 'email', to: 'email' }],
  },
  searchByIDNotFound: {
    msg: 'User with ID {id} not found.',
    replace: [{ from: 'id', to: 'id' }],
  },
};

export default userMessages;
