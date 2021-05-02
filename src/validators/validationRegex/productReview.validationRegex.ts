import dotenv from 'dotenv';
import { validationRegex } from '../validator';

dotenv.config();
const defaultRegexForNames = process.env.DEFAULT_REGEX_FOR_NAMES;

const productReviewValidationRegex: validationRegex[] = [
  {
    field: 'title',
    validations: [
      { regex: `^[${defaultRegexForNames}0-9!@?#$%*- ]+$` },
      {
        regex: '^.{4,255}$',
        message: 'The field title must have 4 to 255 characters.',
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
        message: 'The field description must have 4 to 255 characters.',
      },
    ],
  },
];

export default productReviewValidationRegex;
