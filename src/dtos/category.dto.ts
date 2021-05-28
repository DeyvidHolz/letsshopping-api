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

type GetCategoryDto = {
  id: number;
};

type DeleteCategoryDto = {
  id: number;
};

export {
  CreateCategoryDto,
  UpdateCategoryDto,
  GetCategoryDto,
  DeleteCategoryDto,
};
