import { validationRegex } from '../validator';

const shopInfoValidationRegex: validationRegex[] = [
  {
    field: 'name',
    regex: '^.{4,60}$',
  },
];

export default shopInfoValidationRegex;
