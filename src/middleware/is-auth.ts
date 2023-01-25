import jwt from 'jsonwebtoken';
import {Response, Request, NextFunction} from "express";


const isAuth = (req:Request, res:Response, next:NextFunction) => {
    try{
        const userId = req.cookies.userId;
        const token = req.cookies.token;
        console.log(token);
        let ifVerifiedToken: any;

        ifVerifiedToken = jwt.verify(token, 'somesupersecretsecret');
        console.log(ifVerifiedToken);

        if(ifVerifiedToken.userId !== +userId){
            req.body.error = true;
        }

        if(!ifVerifiedToken || !token) {
            req.body.error = true;
        }

        next();
    } catch (err){
        req.body.error = true;
    }
};

export default isAuth;