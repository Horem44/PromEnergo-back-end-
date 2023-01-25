import {DataTypes, Model} from "sequelize";
import db from "../config/database.config";

interface TokenAttributes {
    id?: number,
    expirationTime: Date,
    token: string,
    UserId: number
}

export class Token extends Model<TokenAttributes> {}

Token.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    expirationTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db,
    tableName: 'tokens'
});
