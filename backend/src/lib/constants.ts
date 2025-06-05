export const SUBSCRIPTION_PLANS = { 
  basic: {
    name: "Basic",
    price: Math.round(19.99 * 100), 
    plan_id: process.env.BASIC_PLAN_ID,
  },
  pro: {
    name: "Pro",
    price: Math.round(49.99 * 100), 
    plan_id: process.env.PRO_PLAN_ID,
  },
};
