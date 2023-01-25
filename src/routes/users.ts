import express from "express";
import {body} from "express-validator";

import {
    changePassword,
    createUser,
    getUser,
    getUsers,
    loginUser,
    logoutUser,
    sendResetPasswordEmail,
    updateUserDelivery,
    updateUserInfo,
} from "../controllers/users";
import registrationValidators from "../validators/registrationValidators";
import loginValidators from "../validators/loginValidators";
import userInfoValidators from "../validators/userInfoValidators";
import isAuth from "../middleware/is-auth";

const router = express.Router();

//GET Users
router.get('/', getUsers);

//GET User
router.get('/single', isAuth, getUser);

//POST User (registration)
router.post('/registration', registrationValidators, createUser);

//POST Login User
router.post('/login', loginValidators, loginUser);

//Get Logout User
router.get('/logout', logoutUser);

//POST Update UserInfo
router.post('/update', isAuth, userInfoValidators, updateUserInfo);

//POST Update UserDeliveryInfo
router.post('/update/delivery', isAuth, updateUserDelivery);

//POST Password reset
router.post('/reset', isAuth, [body('email').isEmail()], sendResetPasswordEmail);

//POST Change Password
router.post('/reset/:token', isAuth, [
    body('password').notEmpty().isLength({min: 6}),
    body('confirmPassword').notEmpty().isLength({min: 6}).equals('password')
], changePassword);


export default router;