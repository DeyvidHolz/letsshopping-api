import dotenv from 'dotenv';
import { validationRegex } from '../validator';

dotenv.config();
const defaultRegexForNames = process.env.DEFAULT_REGEX_FOR_NAMES;

const categoryValidationRegex: validationRegex[] = [
  {
    field: 'name',
    validations: [
      { regex: `^[${defaultRegexForNames}&0-9 ]+$` },
      {
        regex: '^.{4,255}$',
        message: 'The field name must have 4 to 255 characters.',
      },
    ],
  },
  {
    field: 'shortDescription',
    validations: [
      {
        regex: '^.{0,255}$',
        message: 'The field short description must have 0 to 255 characters.',
      },
    ],
  },
  {
    field: 'description',
    validations: [
      {
        regex: '^.{0,10000}$',
        message: 'The field description must have 6 characters.',
      },
    ],
  },
];

export default categoryValidationRegex;
