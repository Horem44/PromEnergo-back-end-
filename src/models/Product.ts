import {DataTypes, Model} from "sequelize";
import db from "../config/database.config";

export interface ProductAttributes {
    id?: number,
    title: string,
    price: number,
    imgUrl: string,
    category: string
}

export class Product extends Model<ProductAttributes>{}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(6,2),
        allowNull: false
    },
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'products'
});
