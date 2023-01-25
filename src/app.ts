import express, {Application, NextFunction, Request, Response} from 'express';
import db from './config/database.config';
import bodyParser from "body-parser";
import productRoutes from './routes/products';
import userRoutes from './routes/users';
import * as path from "path";
import multer, {FileFilterCallback} from 'multer';
import cookieParser from "cookie-parser";
import cors from 'cors';
import router from "./routes/users";
import isAuth from "./middleware/is-auth";
import errorHandler from "./middleware/errorHandler";

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

const corsOptions ={
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

app.use(cors(corsOptions));

app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/static', express.static(path.join(__dirname,'../','public')));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'https://localhost:3000');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header(
//         "Access-Control-Allow-Methods",
//         "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//     );
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     next();
// });

app.use(productRoutes);
app.use('/users', userRoutes);
app.get('/', isAuth, (req:Request, res:Response) => {
    return res.status(200).json({isNotAuth: req.body.isNotAuth})
});

app.use(errorHandler);

db.sync().then(() => {
    console.log('connected');
    app.listen(port);
}).catch(err => console.log(err));

