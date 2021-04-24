import { validationRegex } from '../validator';

const orderValidationRegex: validationRegex[] = [
  {
    field: 'totalValue',
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'subtotal',
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'freightValue',
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'status',
    required: false,
    validations: [{ regex: '^[0-4]{1}$' }],
  },
  {
    field: 'paymentMethod',
    required: false,
    validations: [{ regex: '^(0){1}$' }],
  },
];

export default orderValidationRegex;
