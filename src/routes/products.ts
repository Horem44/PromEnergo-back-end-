import express from "express";
import {getProducts, createProduct} from "../controllers/products";
import {createUser, getUsers} from "../controllers/users";

const router = express.Router();


//GET products
router.get('/products', getProducts);
router.get('/users', getUsers);

//POST product
router.post('/product', createProduct);
router.post('/user', createUser);

export default router;