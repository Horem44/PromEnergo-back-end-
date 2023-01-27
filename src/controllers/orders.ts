import {Order} from "../models/Order";
import {NextFunction, Request, Response} from "express";
import OrderProduct from "../models/OrderProduct";
import {Product} from "../models/Product";
import {Op} from "sequelize";
import {Error} from "../models/Error";

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    const userId = +req.cookies.userId;

    try {
        const userOrders:any = await OrderProduct.findAll({
            include: [
                {
                    model: Order,
                    where: {
                        UserId: userId
                    }
                }]
        });

        if(userOrders.length === 0){
            throw new Error('User has no orders');
        }

        let userOrderIds = [];
        let orders = [];

        for(let order of userOrders){
            orders.push(order.dataValues.Order.dataValues);
            userOrderIds.push(order.dataValues.Order.dataValues.id);
        }

        const userOrderProducts:any = await OrderProduct.findAll({
            where: {
                OrderId: {
                    [Op.or]: userOrderIds
                }
            },
            include: {
                model: Product
            }
        });

        let products = [];

        for(let product of userOrderProducts){
            products.push(product.dataValues.Product.dataValues);
        }

        return res.status(200).json({orders, products});
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = +req.cookies.userId;
    const prodId = req.body.prodId;
    const price = parseFloat(req.body.price);

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