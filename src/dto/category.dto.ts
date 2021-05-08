type CreateCategoryDto = {
  name: string;
  shortDescription?: string;
  description?: string;
};

type UpdateCategoryDto = {
  id: number;
  name: string;
  shortDescription?: string;
  description?: string;
};

export { CreateCategoryDto, UpdateCategoryDto };
