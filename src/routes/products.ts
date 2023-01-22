import express from "express";
import {getProducts, createProduct} from "../controllers/products";

const router = express.Router();


//GET products
router.get('/products', getProducts);

//POST product
router.post('/product', createProduct);

export default router;