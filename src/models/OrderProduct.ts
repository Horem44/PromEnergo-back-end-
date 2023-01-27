import db from "../config/database.config";
import {Association, DataTypes, Model} from "sequelize";
import {Product} from "./Product";
import {Order} from "./Order";

interface OrderProductAttributes {
    id?: number,
    OrderId: number,
    ProductId: number,
}

export class OrderProduct extends Model<OrderProductAttributes>{
    public static associations: {
        orders: Association<OrderProduct>;
    };
}

OrderProduct.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    OrderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'order_products',
    timestamps: false
});

Product.hasMany(OrderProduct);
OrderProduct.belongsTo(Product);

Order.hasMany(OrderProduct);
OrderProduct.belongsTo(Order);

export default OrderProduct;