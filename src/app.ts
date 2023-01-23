import express, {Application} from 'express';
import db from './config/database.config';
import bodyParser from "body-parser";
import productRoutes from './routes/products';
import * as path from "path";
import multer, {FileFilterCallback} from 'multer';
import * as constants from "constants";

const app:Application = express();
const port:number = 8080;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname,'../','public', 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req:any, file:any, cb:FileFilterCallback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use(bodyParser.json());

app.use('/static', express.static(path.join(__dirname,'../','public')));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(productRoutes);

db.sync().then(() => {
    console.log('connected');
    app.listen(port);
}).catch(err => console.log(err));

