import dotenv from 'dotenv';
import { ValidationRegex } from '../validator';

dotenv.config();
const defaultRegexForNames = process.env.DEFAULT_REGEX_FOR_NAMES;

const productOptionValidationRegex: ValidationRegex[] = [
  {
    field: 'name',
    validations: [
      { regex: `^[${defaultRegexForNames}&0-9 ]+$` },
      {
        regex: '^.{3,255}$',
        message: 'The field name must have 3 to 255 characters.',
      },
    ],
  },
];

export default productOptionValidationRegex;
