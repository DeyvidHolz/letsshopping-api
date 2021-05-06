type createCouponDto = {
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

type updateCouponDto = {
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

export { createCouponDto, updateCouponDto };
