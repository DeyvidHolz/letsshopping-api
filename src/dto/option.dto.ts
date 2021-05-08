import { OptionValue } from './optionValue.dto';

type Option =
  | {
      name: string;
      values: OptionValue[];
    }
  | number;

export { Option };
