import jwt from 'jsonwebtoken';
import {Response, Request, NextFunction} from "express";


const isAuth = (req:Request, res:Response, next:NextFunction) => {
    try{
        const token = req.cookies.token;
        console.log(token);
        let ifVerifiedToken;

        ifVerifiedToken = jwt.verify(token, 'somesupersecretsecret');

        if(!ifVerifiedToken || !token) {
            req.body.error = true;
        }

        next();
    } catch (err){
        req.body.error = true;
    }
};

export default isAuth;