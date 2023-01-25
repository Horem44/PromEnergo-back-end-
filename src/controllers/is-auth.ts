import jwt, {JwtPayload} from 'jsonwebtoken';
import {Response, Request, NextFunction} from "express";


const isAuth = (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.token;
    const userId = req.cookies.userId;
    const decodedToken:any = jwt.decode(token)!;
    const ifSameId = decodedToken!.userId === +userId;
    let ifVerifiedToken;

    try{
        ifVerifiedToken = jwt.verify(token, 'somesupersecretsecret');

        if(!ifVerifiedToken || !token) {
            return res.status(401).json({isAuth: false});
        }

        if(!ifSameId){
            return res.status(401).json({isAuth: false});
        }

        return res.status(200).json({isAuth: true});
    } catch (err){
        return res.status(401).json({isAuth: false});
    }

};

export default isAuth;