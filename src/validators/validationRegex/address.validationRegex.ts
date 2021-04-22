import { validationRegex } from '../validator';

const userValidationRegex: validationRegex[] = [
  {
    field: 'zipCode',
    validations: [
      { regex: `^[0-9]${process.env.COUNTRY_ZIP_CODE_LENGTH}$` },
      {
        regex: '^.{4,255}$',
        message: 'The username must have 4 to 255 characters.',
      },
    ],
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

export default userValidationRegex;
