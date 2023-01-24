import express from "express";
import {getProducts, createProduct, getProduct} from "../controllers/products";


const router = express.Router();


//GET products (pagination)
router.get('/products/:page', getProducts);

//GET product
router.get('/product/:prodId', getProduct);

//POST product
router.post('/product', createProduct);

export default router;