import { ValidationRegex } from '../validator';

const shopInfoValidationRegex: ValidationRegex[] = [
  {
    field: 'name',
    regex: '^.{4,60}$',
  },
];

export default shopInfoValidationRegex;
