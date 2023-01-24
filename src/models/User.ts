import {DataTypes, Model} from "sequelize";
import db from "../config/database.config";
import {Order} from "./Order";

export interface UserAttributes {
    id?: number,
    name: string,
    email: number,
    password: string,
    phoneNumber: string,
    organisationName: string
}

export class User extends Model<UserAttributes>{}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    organisationName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'users'
});

User.hasMany(Order, {
    onDelete: 'cascade'
});

Order.belongsTo(User, {
    onDelete: 'cascade'
});