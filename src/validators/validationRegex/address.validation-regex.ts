import dotenv from 'dotenv';
import { ValidationRegex } from '../validator';

dotenv.config();
const defaultRegexForNames = process.env.DEFAULT_REGEX_FOR_NAMES;

const addressValidationRegex: ValidationRegex[] = [
  {
    field: 'zipCode',
    validations: [{ regex: `^[0-9]{${process.env.COUNTRY_ZIP_CODE_LENGTH}}$` }],
  },
  {
    field: 'state',
    validations: [
      {
        regex: `^[${defaultRegexForNames}]{2}$`,
      },
    ],
  },
  {
    field: 'neighbourhood',
    validations: [
      {
        regex: `^[${defaultRegexForNames} ]{4,255}$`,
      },
    ],
  },
  {
    field: 'street',
    validations: [
      {
        regex: `^[${defaultRegexForNames}. ]{4,255}$`,
      },
    ],
  },
  {
    field: 'number',
    validations: [
      {
        regex: '^[0-9]{1,5}$',
      },
    ],
  },
];

export default addressValidationRegex;
