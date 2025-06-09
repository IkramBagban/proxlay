export const SUBSCRIPTION_PLANS = { 
  basic: {
    name: "Basic",
    amount: Math.round(19.99 * 100),
    plan_id: process.env.BASIC_PLAN_ID,
  },
  pro: {
    name: "Pro",
    amount: Math.round(49.99 * 100), 
    plan_id: process.env.PRO_PLAN_ID,
  },
};
