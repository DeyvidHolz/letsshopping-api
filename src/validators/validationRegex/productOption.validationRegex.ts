import { validationRegex } from '../validator';

const productOptionValidationRegex: validationRegex[] = [
  {
    field: 'name',
    validations: [
      { regex: '^[A-Za-z0-9 ]+$' },
      {
        regex: '^.{3,255}$',
        message: 'The option name must have 3 to 255 characters.',
      },
    ],
  },
];

export default productOptionValidationRegex;
