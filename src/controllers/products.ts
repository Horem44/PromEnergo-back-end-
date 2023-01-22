import {ProductInstance, ProductAttributes} from "../models/Product";
import {NextFunction, Request, Response} from "express";

export const getProducts = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const products = await ProductInstance.findAll();
        return res.json(products);
    }catch (err) {
        console.log(err);
    }
};

export const createProduct = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const product:ProductAttributes = {
            title: req.body.title,
            price: req.body.price,
            imgUrl: req.body.imgUrl
        };

        const record = await ProductInstance.create(product);
        return res.json(record);
    }catch (err) {
        console.log(err);
    }
}