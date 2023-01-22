import express, {NextFunction, Response, Request, Application} from 'express';
import db from './config/database.config';
import bodyParser from "body-parser";
import {ProductInstance} from "./models/Product";
import {getProducts} from "./controllers/products";
import productRoutes from './routes/products';

const app:Application = express();
const port:number = 8080;

app.use(bodyParser.json());

app.post('/', async (req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    try{
        const record = await ProductInstance.create({...req.body})
        return res.json({record, msg: 'create OK'});
    }catch (err) {
        return res.json({status: 500, msg: 'create failed', err});
    }
});

app.use(productRoutes);

db.sync().then(() => {
    console.log('connected');
    app.listen(port);
}).catch(err => console.log(err))

