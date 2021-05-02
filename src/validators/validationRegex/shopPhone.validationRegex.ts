import { validationRegex } from '../validator';

const shopPhoneValidationRegex: validationRegex[] = [
  {
    field: 'value',
    regex: '^[0-9]+$',
  },
];

export default shopPhoneValidationRegex;
