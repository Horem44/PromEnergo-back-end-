import {DataTypes, Model} from "sequelize";
import db from "../config/database.config";

interface OrderAttributes {
    id: number,
    orderDate: Date,
    status: boolean,
}

export class OrderInstance extends Model<OrderAttributes>{}

OrderInstance.init({
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
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    sequelize: db,
    tableName: 'orders'
});