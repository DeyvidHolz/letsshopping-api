import { validationRegex } from '../validator';

const shippingValidationRegex: validationRegex[] = [
  {
    field: 'status',
    validations: [{ regex: '^[0-4]{1}$' }],
  },
];

export default shippingValidationRegex;
