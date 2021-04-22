import { validationRegex } from '../validator';

const productValidationRegex: validationRegex[] = [
  {
    field: 'name',
    validations: [
      { regex: '^[A-Za-z0-9 ]+$' },
      {
        regex: '^.{4,255}$',
        message: 'The product name must have 4 to 255 characters.',
      },
    ],
  },
  {
    field: 'shortDescription',
    validations: [
      {
        regex: '^.{0,255}$',
        message: 'The short description must have 0 to 255 characters.',
      },
    ],
  },
  {
    field: 'description',
    validations: [
      {
        regex: '^.{0,10000}$',
        message: 'The product code must have 6 characters.',
      },
    ],
  },
];

export default productValidationRegex;
