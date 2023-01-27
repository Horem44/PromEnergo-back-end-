import {Order} from "../models/Order";
import {NextFunction, Request, Response} from "express";
import OrderProduct from "../models/OrderProduct";

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.findAll();
        return res.status(200).json(orders);
    } catch (err) {
        console.log(err);
    }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.cookies.userId;
    const prodId = req.body.prodId;
    const price = req.body.price;

    try {
        let existingOrder: any = await OrderProduct.findOne({
            where: {
                ProductId: prodId
            },
            include: [{
                model: Order,
                where: {
                    UserId: userId
                },
            }],
        });

        if (existingOrder) {
            const existingOrderId: number = +JSON.stringify(existingOrder["Order"]["id"]);
            const existingOrderQuantity: number = +JSON.stringify(existingOrder["Order"]["quantity"]) as unknown as number;
            const existingOrderPrice: number = parseFloat(JSON.stringify(existingOrder["Order"]["totalPrice"]).replace('"', ''));

            let updatedOrder = await Order.findByPk(existingOrderId)
            updatedOrder = await updatedOrder!.update({
                quantity: existingOrderQuantity + 1,
                totalPrice: existingOrderPrice + price,
            });

            return res.status(200).json(updatedOrder);
        }else {
            const newOrder = await Order.create({
                totalPrice: price,
                quantity: 1,
                orderDate: new Date().toDateString(),
                UserId: userId,
                status: false,
            });

            await OrderProduct.create({
                ProductId: +prodId,
                OrderId: newOrder.dataValues.id!
            });

            return res.status(200).json(newOrder);
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
}