import express, {Application} from 'express';
import db from './config/database.config';
import bodyParser from "body-parser";
import productRoutes from './routes/products';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import * as path from "path";
import multer, {FileFilterCallback} from 'multer';
import cookieParser from "cookie-parser";


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
app.use(cookieParser());

app.use('/static', express.static(path.join(__dirname,'../','public')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});


app.use(productRoutes);
app.use('/users', userRoutes);
app.use(authRoutes);

db.sync().then(() => {
    console.log('connected');
    app.listen(port);
}).catch(err => console.log(err));

