import {Product, ProductAttributes} from "../models/Product";
import {NextFunction, query, Request, Response} from "express";
import imgPathFormatter from "../util/imgPathFormatter";
import {Op} from "sequelize";

type filterParams = {
    category: string
}[];

export const getProducts = async (req:Request, res:Response, next:NextFunction) => {
    try{
        console.log(req.cookies);
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

        return res.json(products);
    }catch (err) {
        console.log(err);
    }
};

export const getProduct = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const product = await Product.findByPk(+req.params.prodId);
        return res.json(product);
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