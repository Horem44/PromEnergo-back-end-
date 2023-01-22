import {Sequelize} from "sequelize";

const db = new Sequelize(
    "prom_energo_db",
    "root",
    "12345678",
    {
        dialect: "mysql",
    }
);

export default db;