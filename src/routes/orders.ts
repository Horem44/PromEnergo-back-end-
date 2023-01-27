import express from "express";
import {createOrder, getOrders} from "../controllers/orders";

const router = express.Router();

router.get('/orders', getOrders);

router.post('/order', createOrder);

export default router;