import express from "express";
import {createUser, getUser, getUsers, loginUser, updateUser} from "../controllers/users";

const router = express.Router();

//GET Users
router.get('/', getUsers);

//GET User
router.get('/single', getUser);

//POST User (registration)
router.post('/registration', createUser);

//POST Login User
router.post('/login', loginUser);

//POST Update User
router.post('/update', updateUser);


export default router;