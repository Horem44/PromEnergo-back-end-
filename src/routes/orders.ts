import express from "express";
import {createOrder, getUserOrders} from "../controllers/orders";

const router = express.Router();

router.get('/orders/user', getUserOrders);

router.post('/order', createOrder);

export default router;