type CreateCouponDto = {
  code: string;
  name: string;
  description?: string;
  discountType?: number;
  discountAmount: number;
  maxUsesPerUser?: number;
  maxUsers?: number;
  isActive?: boolean;
  ruleMinPrice?: number;
};

type UpdateCouponDto = {
  id: number;
  code: string;
  name: string;
  description?: string;
  discountType?: number;
  discountAmount: number;
  maxUsesPerUser?: number;
  maxUsers?: number;
  isActive?: boolean;
  ruleMinPrice?: number;
};

type GetCouponDto = {
  id: number;
};

type DeleteCouponDto = {
  id: number;
};

export { CreateCouponDto, UpdateCouponDto, GetCouponDto, DeleteCouponDto };
