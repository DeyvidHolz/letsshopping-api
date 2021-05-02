import { validationRegex } from '../validator';

const shopSocialValidationRegex: validationRegex[] = [
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
