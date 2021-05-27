import dotenv from 'dotenv';
import { ValidationRegex } from '../validator';

dotenv.config();
const defaultRegexForNames = process.env.DEFAULT_REGEX_FOR_NAMES;

const productValidationRegex: ValidationRegex[] = [
  {
    field: 'name',
    validations: [
      { regex: `^[${defaultRegexForNames}&0-9 ]+$` },
      {
        regex: '^.{4,255}$',
        message: 'The field name must have 4 to 255 characters.',
      },
    ],
  },
  {
    field: 'code',
    validations: [
      { regex: '^[A-Za-z0-9]+$' },
      { regex: '^.{6}$', message: 'The field code must have 6 characters.' },
    ],
  },
  {
    field: 'shortDescription',
    validations: [
      {
        regex: '^.{0,255}$',
        message: 'The field short description must have 0 to 255 characters.',
      },
    ],
  },
  {
    field: 'description',
    validations: [
      {
        regex: '^.{1,10000}$',
        message: 'The field description must have 0 to 10000 characters.',
      },
    ],
  },
  {
    field: 'mainImage',
    validations: [
      {
        regex: '^[A-Za-z0-9 _]+.[A-Za-z0-9]+$',
        message: 'Invalid file name. Please, rename your file and try again.',
      },
      {
        regex: '^.*.((jpg)|(jpeg)|(png))$',
        message: 'This type of image is not supported. Use jpg or png images.',
      },
      { regex: '^.{0,255}$', message: 'The image name is too long.' },
    ],
  },

  {
    field: 'price',
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'stock',
    required: false,
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'weight',
    required: false,
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'width',
    required: false,
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'height',
    required: false,
    validations: [{ regex: '^[0-9]+$' }],
  },
];

export default productValidationRegex;
