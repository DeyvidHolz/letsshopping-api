type optionValue = {
  value: string;
  price: number;
  mainImage?: string;
  isActive?: boolean;
  stock: number;
};

type option =
  | {
      name: string;
      values: optionValue[];
    }
  | number;

export { option, optionValue };
