import express from "express";
import {getProducts, createProduct, getProduct, updateProduct, deleteProduct} from "../controllers/products";
import isAuth from "../middleware/is-auth";
import isAdmin from "../middleware/is-admin";


const router = express.Router();


//GET products (pagination)
router.get('/products/:page', getProducts);

//GET product
router.get('/product/:prodId', getProduct);

//POST product
router.post('/product', isAdmin, createProduct);

//UPDATE product
router.post('/product/update/:prodId', isAdmin, updateProduct);

//DELETE product
router.delete('/product/delete/:prodId', isAdmin, deleteProduct);

export default router;