import express from "express";
import {createUser, getUsers, loginUser} from "../controllers/users";

const router = express.Router();

//GET Users
router.get('/', getUsers);

//POST User (registration)
router.post('/registration', createUser);

//POST Login User
router.post('/login', loginUser);


export default router;