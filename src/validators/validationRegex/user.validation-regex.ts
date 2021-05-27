import dotenv from 'dotenv';
import { ValidationRegex } from '../validator';

dotenv.config();
const defaultRegexForNames = process.env.DEFAULT_REGEX_FOR_NAMES;

const userValidationRegex: ValidationRegex[] = [
  {
    field: 'username',
    validations: [
      { regex: '^[\\w\\.]+$' },
      {
        regex: '^.{4,255}$',
        message: 'The field username must have 4 to 255 characters.',
      },
    ],
  },
  {
    field: 'password',
    validations: [
      {
        regex: '^.{6,60}$',
        message: 'The field password is too short or too long.',
      },
    ],
  },
  {
    field: 'firstName',
    validations: [{ regex: `^[${defaultRegexForNames}]+$` }],
  },
  {
    field: 'lastName',
    validations: [{ regex: `^[${defaultRegexForNames} ]+$` }],
  },
];

export default userValidationRegex;
