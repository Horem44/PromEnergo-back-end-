import express from "express";
import {
    changePassword,
    createUser,
    getUser,
    getUsers,
    loginUser, logoutUser,
    sendResetPasswordEmail,
    updateUserDelivery,
    updateUserInfo
} from "../controllers/users";

const router = express.Router();

//GET Users
router.get('/', getUsers);

//GET User
router.get('/single', getUser);

//POST User (registration)
router.post('/registration', createUser);

//POST Login User
router.post('/login', loginUser);

//Get Logout User
router.get('/logout', logoutUser);

//POST Update UserInfo
router.post('/update', updateUserInfo);

//POST Update UserInfo
router.post('/update/delivery', updateUserDelivery);

//POST Password reset
router.post('/reset', sendResetPasswordEmail);

//POST Change Password
router.post('/reset/:token', changePassword);



export default router;