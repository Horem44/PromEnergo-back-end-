import {Product, ProductAttributes} from "../models/Product";
import {NextFunction, query, Request, Response} from "express";
import imgPathFormatter from "../util/imgPathFormatter";
import {Op} from "sequelize";

type filterParams = {
    category: string
}[];

export const getProducts = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const filterParams: filterParams = [];
        for(let categoryName in req.query) {
            filterParams.push({category: categoryName});
        }

        const page = +req.params.page;
        const maxItemsAmountOnPage = 8;
        const offset = page * maxItemsAmountOnPage;

        const where = filterParams.length === 0 ? {} : {
            [Op.or]: filterParams
        }

        const products = await Product.findAndCountAll({
            offset,
            limit: maxItemsAmountOnPage,
            where
        });

        return res.status(200).json({products: products});
    }catch (err) {
        next(err);
    }
};

export const getProduct = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const product = await Product.findByPk(+req.params.prodId);
        return res.status(200).json(product);
    }catch (err) {
        next(err);
    }
};

export const createProduct = async (req:Request, res:Response, next:NextFunction) => {
    try {
        if(!req.body.isAdmin){
            return res.status(401).end();
        }

        const product:ProductAttributes = {
            title: req.body.title,
            price: req.body.price,
            imgUrl: imgPathFormatter(req.file?.path!),
            category: req.body.category
        };

        const record = await Product.create(product);
        return res.status(200).json(record);
    }catch (err) {
        next(err);
    }
}

export const updateProduct = async (req:Request, res:Response, next:NextFunction) => {
    try {
        if(!req.body.isAdmin){
            return res.status(401).end();
        }

        const prodId = req.params.prodId;

        const newProduct:ProductAttributes = {
            title: req.body.title,
            price: req.body.price,
            imgUrl: imgPathFormatter(req.file?.path!),
            category: req.body.category
        };

        const product = await Product.findByPk(+prodId);
        await product?.update(newProduct)
        return res.status(200).json(product);
    }catch (err) {
        next(err);
    }
}

export const deleteProduct = async (req:Request, res:Response, next:NextFunction) => {
    try {
        if(!req.body.isAdmin){
            return res.status(401).end();
        }

        const prodId = req.params.prodId;

        const product = await Product.findByPk(+prodId);
        await product?.destroy()
        return res.status(200).end();
    }catch (err) {
        next(err);
    }
}