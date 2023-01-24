import jwt from 'jsonwebtoken';
import {Response, Request, NextFunction} from "express";

const isAuth = (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.token;
    let decodedToken;

    try{
        decodedToken = jwt.verify(token, 'somesupersecretsecret');

        if(!decodedToken || !token) {
            res.status(401).json({isAuth: false});
        }

        res.status(200).json({isAuth: true});
    } catch (err){
        res.status(401).json({isAuth: false});
    }

};

export default isAuth;