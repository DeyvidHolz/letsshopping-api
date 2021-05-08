import { ValidationRegex } from '../validator';

const permissionGroupValidationRegex: ValidationRegex[] = [
  {
    field: 'name',
    validations: [
      {
        regex: '^[A-Za-z0-9]+$',
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

export default permissionGroupValidationRegex;
