import {Request, Response, NextFunction} from "express";
import checkAdminCredentials, {adminCredentials} from "../util/checkAdminCredentials";
import jwt from "jsonwebtoken";


const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const credentialsToCheck:adminCredentials = {
        email: req.body.email,
        password: req.body.password
    }

    if(credentialsToCheck.email && credentialsToCheck.password){
        req.body.isAdmin = checkAdminCredentials(credentialsToCheck);
        next();
    }else{
        try{
            const userId = req.cookies.userId;
            const token = req.cookies.token;
            let ifVerifiedToken: any;

            ifVerifiedToken = jwt.verify(token, 'somesupersecretsecret');

            if(ifVerifiedToken.userId !== +userId){
                req.body.isAdmin = false;
            }

            if(!ifVerifiedToken || !token) {
                req.body.isAdmin = false;
            }

            if(ifVerifiedToken.email === 'admin@admin.com'){
                req.body.isAdmin = true;
            }

            next();
        } catch (err){
            console.log(err);
            req.body.isAdmin = false;
            next();
        }
    }
}

export default isAdmin;