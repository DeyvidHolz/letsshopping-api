type createCategoryDto = {
  name: string;
  shortDescription?: string;
  description?: string;
};

type updateCategoryDto = {
  id: number;
  name: string;
  shortDescription?: string;
  description?: string;
};

export { createCategoryDto, updateCategoryDto };
