import express from "express";
import {
    createOrder,
    deleteAdminOrder,
    deleteOrder,
    getOrders,
    getUserOrders,
    updateOrderStatus
} from "../controllers/orders";
import isAuth from "../middleware/is-auth";
import isAdmin from "../middleware/is-admin";



const router = express.Router();

router.get('/orders/user', isAuth, getUserOrders);

router.post('/order', isAuth, createOrder);

router.delete('/order/delete/:prodId', isAuth, deleteOrder)

router.get('/orders', isAdmin, getOrders);

router.post('/orders/update-status', isAuth, updateOrderStatus);

router.delete('/order/admin/delete/:orderId', isAdmin, deleteAdminOrder)

export default router;