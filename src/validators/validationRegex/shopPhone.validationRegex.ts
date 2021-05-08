import { ValidationRegex } from '../validator';

const shopPhoneValidationRegex: ValidationRegex[] = [
  {
    field: 'value',
    regex: '^[0-9]+$',
  },
];

export default shopPhoneValidationRegex;
