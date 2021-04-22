import { validationRegex } from '../validator';

const userValidationRegex: validationRegex[] = [
  {
    field: 'username',
    validations: [
      { regex: '^[\\w\\.]+$' },
      {
        regex: '^.{4,255}$',
        message: 'The username must have 4 to 255 characters.',
      },
    ],
  },
  {
    field: 'password',
    validations: [
      {
        regex: '^.{6,60}$',
        message: 'The password is too short or too long.',
      },
    ],
  },
  {
    field: 'firstName',
    validations: [
      {
        regex: '^[A-Za-z]+$',
      },
    ],
  },
  {
    field: 'lastName',
    validations: [
      {
        regex: '^[A-Za-z ]+$',
      },
    ],
  },
];

export default userValidationRegex;
