import {OrderInstance} from "../models/Order";

export const getOrders = async () => {
    try{
        const orders = await OrderInstance.findAll();
        return orders;
    }catch (err) {
        console.log(err);
    }
}