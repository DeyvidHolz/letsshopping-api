import { validationRegex } from '../validator';

const shopEmailValidationRegex: validationRegex[] = [
  {
    field: 'value',
    regex: '^[A-Za-z0-9.]+@[A-Za-z0-9]+\\.[A-Za-z0-9]+$',
  },
];

export default shopEmailValidationRegex;
