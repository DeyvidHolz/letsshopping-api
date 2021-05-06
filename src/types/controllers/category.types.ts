type createCategoryPayload = {
  name: string;
  shortDescription?: string;
  description?: string;
};

type updateCategoryPayload = {
  id: number;
  name: string;
  shortDescription?: string;
  description?: string;
};

export { createCategoryPayload, updateCategoryPayload };
