import {DataTypes, Model} from "sequelize";
import db from "../config/database.config";
import {Product} from "./Product";

interface OrderAttributes {
    id: number,
    orderDate: Date,
    quantity: number,
    totalPrice: number,
    status: boolean,
}

export class Order extends Model<OrderAttributes>{}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    orderDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(6,2),
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    sequelize: db,
    tableName: 'orders'
});

Product.belongsToMany(Order, {through: 'order_products'});
Order.belongsToMany(Product, {through: 'order_products'});