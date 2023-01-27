import {DataTypes, Model} from "sequelize";
import db from "../config/database.config";

interface OrderAttributes {
    id?: number,
    orderDate: string,
    quantity: number,
    totalPrice: number,
    UserId: number,
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
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    sequelize: db,
    tableName: 'orders'
});
