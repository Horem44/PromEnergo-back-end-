import {Order} from "../models/Order";

export const getOrders = async () => {
    try{
        const orders = await Order.findAll();
        return orders;
    }catch (err) {
        console.log(err);
    }
}