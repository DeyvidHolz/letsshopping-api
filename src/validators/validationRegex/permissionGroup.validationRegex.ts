import { validationRegex } from '../validator';

const userValidationRegex: validationRegex[] = [
  {
    field: 'name',
    validations: [
      {
        regex: '^[A-Za-z ]+$',
      },
    ],
  },
  {
    field: 'level',
    validations: [
      {
        regex: '^[0-1]$',
        message:
          'Invalid level value. Allowed values: 0 (for default) or 1 (for admin).',
      },
    ],
  },
];

export default userValidationRegex;
