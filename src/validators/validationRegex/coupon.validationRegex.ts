import dotenv from 'dotenv';
import { ValidationRegex } from '../validator';

dotenv.config();
const defaultRegexForNames = process.env.DEFAULT_REGEX_FOR_NAMES;

const couponValidationRegex: ValidationRegex[] = [
  {
    field: 'code',
    validations: [{ regex: '^[A-Za-z0-9]{6}$' }],
  },
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
    field: 'description',
    validations: [
      {
        regex: '^.{4,255}$',
        message: 'The field description must have 4 to 255 characters.',
      },
    ],
  },
  {
    field: 'discountType',
    required: false,
    validations: [{ regex: '^(0|1){1}$' }],
  },
  {
    field: 'discountAmount',
    required: false,
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'maxUsesPerUser',
    required: false,
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'maxUsers',
    required: false,
    validations: [{ regex: '^[0-9]+$' }],
  },
  {
    field: 'ruleMinPrice',
    required: false,
    validations: [{ regex: '^[0-9]+$' }],
  },
];

export default couponValidationRegex;
