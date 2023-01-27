import express from "express";
import {createOrder, deleteOrder, getUserOrders} from "../controllers/orders";


const router = express.Router();

router.get('/orders/user', getUserOrders);

router.post('/order', createOrder);

router.delete('/order/delete/:prodId', deleteOrder)

export default router;