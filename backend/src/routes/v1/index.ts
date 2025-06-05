import PaymentRoutes from "./payment.route";
import express from "express";

const router = express.Router();

router.use("/payments", PaymentRoutes);

export default router;
