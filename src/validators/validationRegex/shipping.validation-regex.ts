import { ValidationRegex } from '../validator';

const shippingValidationRegex: ValidationRegex[] = [
  {
    field: 'status',
    validations: [{ regex: '^[0-4]{1}$' }],
  },
];

export default shippingValidationRegex;
