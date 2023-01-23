import {UserAttributes, User} from "../models/User";
import {NextFunction, Request, Response} from "express";

export const getUsers = async (req: Request, res:Response, next: NextFunction) => {
    try{
        const users = await User.findAll();
        return res.json(users);
    }catch (err) {
        console.log(err);
    }
}

export const createUser = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const user:UserAttributes = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber
        };

        const record = await User.create(user);
        return res.json(record);
    }catch (err) {
        console.log(err);
    }
}