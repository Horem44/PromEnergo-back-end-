import jwt from 'jsonwebtoken';
import e, {Response, Request, NextFunction} from "express";

const isAuth = (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.token;
    let decodedToken;

    if(!token) {
        res.status(401).json({message: 'not auth'});
    }

    try{
        decodedToken = jwt.verify(token, 'somesupersecretsecret');
    } catch (err){
        res.status(401).json({message: err});
    }

    if(!decodedToken) {
        res.status(401).json({message: 'not auth'});
    }

    next();
};

export default isAuth;