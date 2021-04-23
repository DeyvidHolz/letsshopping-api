import dotenv from 'dotenv';

import { validationRegex } from '../validator';

dotenv.config();

const addressValidationRegex: validationRegex[] = [
  {
    field: 'zipCode',
    validations: [{ regex: `^[0-9]{${process.env.COUNTRY_ZIP_CODE_LENGTH}}$` }],
  },
  {
    field: 'state',
    validations: [
      {
        regex: '^[A-Za-z]{2}$',
      },
    ],
  },
  {
    field: 'neighbourhood',
    validations: [
      {
        regex: '^[A-Za-z0-9 ]{4,255}$',
      },
    ],
  },
  {
    field: 'street',
    validations: [
      {
        regex: '^[A-Za-z0-9 ]{4,255}$',
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
