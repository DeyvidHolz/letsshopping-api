import { validationRegex } from '../validator';

const productReviewValidationRegex: validationRegex[] = [
  {
    field: 'title',
    validations: [
      { regex: '^[A-Za-z0-9!? ]+$' },
      {
        regex: '^.{4,255}$',
        message: 'The category name must have 4 to 255 characters.',
      },
    ],
  },
  {
    field: 'rating',
    validations: [{ regex: '^[0-9]{1,2}$' }],
  },
  {
    field: 'description',
    required: false,
    validations: [
      {
        regex: '^.{4,255}$',
        message: 'The category name must have 4 to 255 characters.',
      },
    ],
  },
];

export default productReviewValidationRegex;
