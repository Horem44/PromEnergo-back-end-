import jwt, {JwtPayload} from 'jsonwebtoken';
import {Response, Request, NextFunction} from "express";


const isAuth = (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.token;
    console.log(token);
    let ifVerifiedToken;

    try{
        ifVerifiedToken = jwt.verify(token, 'somesupersecretsecret');

        if(!ifVerifiedToken || !token) {
            req.body.error = true;
        }
    } catch (err){
        req.body.error = true;
    }

    next();
};

export default isAuth;