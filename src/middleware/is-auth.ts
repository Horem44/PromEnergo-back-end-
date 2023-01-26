import jwt from 'jsonwebtoken';
import {Response, Request, NextFunction} from "express";


const isAuth = (req:Request, res:Response, next:NextFunction) => {
    try{
        const userId = req.cookies.userId;
        const token = req.cookies.token;
        let ifVerifiedToken: any;

        ifVerifiedToken = jwt.verify(token, 'somesupersecretsecret');

        if(ifVerifiedToken.userId !== +userId){
            req.body.isNotAuth = true;
        }

        if(!ifVerifiedToken || !token) {
            req.body.isNotAuth = true;
        }

        next();
    } catch (err){
        req.body.isNotAuth = true;
        next();
    }
};

export default isAuth;