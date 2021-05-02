import dotenv from 'dotenv';
import { validationRegex } from '../validator';

dotenv.config();
const defaultRegexForNames = process.env.DEFAULT_REGEX_FOR_NAMES;

const productOptionValueValidationRegex: validationRegex[] = [
  {
    field: 'value',
    validations: [
      { regex: `^[${defaultRegexForNames}&0-9 ]+$` },
      {
        regex: '^.{1,255}$',
        message: 'The field value name must have 1 to 255 characters.',
      },
    ],
  },
  {
    field: 'price',
    required: false,
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'mainImage',
    required: false,
    validations: [
      {
        regex: '^[A-Za-z0-9 _]+.[A-Za-z0-9]+$',
        message:
          'Invalid file name for option value. Please, rename your file and try again.',
      },
      {
        regex: '^.*.((jpg)|(jpeg)|(png))$',
        message:
          'This type of image is not supported for option value. Use jpg or png images.',
      },
      {
        regex: '^.{0,255}$',
        message: 'The image name for option value is too long.',
      },
    ],
  },
  {
    field: 'stock',
    required: false,
    validations: [{ regex: '^[0-9]+$' }],
  },
];

export default productOptionValueValidationRegex;
