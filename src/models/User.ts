import {DataTypes, Model} from "sequelize";
import db from "../config/database.config";

interface UserAttributes {
    id: number,
    name: string,
    email: number,
    password: string
}

export class UserInstance extends Model<UserAttributes>{}

UserInstance.init({
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
    }
}, {
    sequelize: db,
    tableName: 'users'
});