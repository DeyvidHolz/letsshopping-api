import { ValidationRegex } from '../validator';

const shopEmailValidationRegex: ValidationRegex[] = [
  {
    field: 'value',
    regex: '^[A-Za-z0-9.]+@[A-Za-z0-9]+\\.[A-Za-z0-9]+$',
  },
];

export default shopEmailValidationRegex;
