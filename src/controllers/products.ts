import {Product, ProductAttributes} from "../models/Product";
import {NextFunction, Request, Response} from "express";
import imgPathFormatter from "../util/imgPathFormatter";

export const getProducts = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const products = await Product.findAll();
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
            imgUrl: imgPathFormatter(req.file?.path!),
            category: req.body.category
        };

        const record = await Product.create(product);
        return res.json(record);
    }catch (err) {
        console.log(err);
    }
}