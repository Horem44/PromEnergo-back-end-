import {Order} from "../models/Order";
import {NextFunction, Request, Response} from "express";
import OrderProduct from "../models/OrderProduct";
import {Product} from "../models/Product";
import {Op} from "sequelize";
import {Error} from "../models/Error";
import {User} from "../models/User";

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    const userId = +req.cookies.userId;

    if(req.body.isNotAuth){
        return res.status(401).json({isNotAuth: true});
    }

    try {
        const userOrders: any = await OrderProduct.findAll({
            include: [
                {
                    model: Order,
                    where: {
                        UserId: userId
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "UserId"]
                    }
                }]
        });

        if (userOrders.length === 0) {
            throw new Error('User has no orders');
        }

        let userOrderIds = [];
        let orders = [];

        for (let order of userOrders) {
            orders.push(order.dataValues.Order.dataValues);
            userOrderIds.push(order.dataValues.Order.dataValues.id);
        }

        const userOrderProducts: any = await OrderProduct.findAll({
            where: {
                OrderId: {
                    [Op.or]: userOrderIds
                }
            },
            include: {
                model: Product
            }
        });

        let counter = 0;

        for (let product of userOrderProducts) {
            orders[counter].prodId = (product.dataValues.Product.dataValues.id);
            orders[counter].prodImgUrl = (product.dataValues.Product.dataValues.imgUrl);
            orders[counter].orderNo = counter + 1;
            counter++;
        }

        return res.status(200).json({orders});
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = +req.cookies.userId;
    const prodId = req.body.prodId;
    const price = parseFloat(req.body.price);

    if(req.body.isNotAuth){
        return res.status(401).json({isNotAuth: true});
    }

    console.log(prodId, price, userId);

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
        } else {
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
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = +req.cookies.userId;
    const prodId = +req.params.prodId;
    console.log(prodId);

    if(req.body.isNotAuth){
        return res.status(401).json({isNotAuth: true});
    }

    try {
        const orderToDelete = await OrderProduct.findOne({
            where: {
                ProductId: prodId
            },
            include: {
                model: Order,
                where: {
                    UserId: userId
                }
            }
        });

        console.log('orderTODELETE', orderToDelete);
        await orderToDelete?.destroy();
        return res.status(200).json({});
    } catch (err) {
        console.log(err);
        next(err)
    }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.isAdmin){
        return res.status(401).end();
    }

    try {
        const ordersData:any[] = await OrderProduct.findAll({
            include: [
                {
                    model: Order, include: [User]},
                    Product
            ]
        });

        if(!ordersData){
            throw new Error('No orders');
        }


        let orders: any[] = ordersData.map(order => {
            return {
                name: order.dataValues.Order.dataValues.User.dataValues.name,
                surname: order.dataValues.Order.dataValues.User.dataValues.surname,
                phoneNumber: order.dataValues.Order.dataValues.User.dataValues.phoneNumber,
                deliveryCity: order.dataValues.Order.dataValues.User.dataValues.deliveryCity,
                warehouse: order.dataValues.Order.dataValues.User.dataValues.warehouse,
                ProductId: order.dataValues.ProductId,
                imgUrl: order.dataValues.Product.dataValues.imgUrl,
                status: order.dataValues.Order.dataValues.status,
                OrderId: order.dataValues.OrderId,
                totalPrice: order.dataValues.Order.dataValues.totalPrice,
                quantity: order.dataValues.Order.dataValues.quantity,
                orderDate: order.dataValues.Order.dataValues.orderDate,
            }
        });

        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
}

export const deleteAdminOrder = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.isAdmin){
        return res.status(401).end();
    }

    const orderId = +req.params.orderId;

    try{
        const order = await OrderProduct.findOne({
            where: {
                OrderId: orderId
            }
        });

        if(!order){
            throw new Error('Server error');
        }

        await order.destroy();

        return res.status(200).end();
    }catch(err){
        console.log(err);
        next(err);
    }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    if(req.body.isNotAuth){
        return res.status(401).json({isNotAuth: true});
    }

    const prodId = req.body.prodId;
    const orderId = req.body.orderId;

    console.log(prodId);
    console.log(orderId);

    try{
        let orderToUpdate:any = await OrderProduct.findOne({
            where:{
                ProductId: prodId,
                OrderId: orderId,
            },
            include: [Order]
        });

        orderToUpdate = orderToUpdate?.dataValues.Order;

        console.log(orderToUpdate);

        await orderToUpdate.update({status: true});

        return res.status(200).json(orderToUpdate);
    }catch(err){
        console.log(err);
        next(err);
    }
};