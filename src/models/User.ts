import {DataTypes, Model} from "sequelize";
import db from "../config/database.config";
import {Order} from "./Order";
import {Token} from "./Token";

export interface UserAttributes {
    id?: number,
    name: string,
    surname: string,
    email: number,
    password: string,
    phoneNumber: string,
    organisationName: string,
    deliveryCity: string,
    warehouse: string
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
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    deliveryCity: {
        type: DataTypes.STRING,
        allowNull: false
    },
    warehouse: {
        type: DataTypes.STRING,
        allowNull: false
    },
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

User.hasOne(Token,  {
    onDelete: 'cascade'
});

Token.belongsTo(User, {
    onDelete: 'cascade'
});