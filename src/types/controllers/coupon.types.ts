type createCouponPayload = {
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

type updateCouponPayload = {
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

export { createCouponPayload, updateCouponPayload };
