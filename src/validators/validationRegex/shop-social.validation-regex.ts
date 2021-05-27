import { ValidationRegex } from '../validator';

const shopSocialValidationRegex: ValidationRegex[] = [
  {
    field: 'name',
    regex: '^.{1,60}$',
  },
  {
    field: 'value',
    regex: '^.{1,60}$',
  },
];

export default shopSocialValidationRegex;
