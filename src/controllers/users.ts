import {User, UserAttributes} from "../models/User";
import {NextFunction, Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../util/sendEmail";
import * as crypto from "crypto";
import {Token} from "../models/Token";
import {Error} from "../models/Error";
import {validationResult} from "express-validator";

export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.cookies.userId;
    if(req.body.isNotAuth){
        return res.status(401).json({isNotAuth: true});
    }

    try {
        const user = await User.findByPk(userId);
        return res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            throw new Error('Validation error', 422, errors.array());
        }

        const saltRounds = 10;

        let name = req.body.name;
        let surname = req.body.surname;
        let email = req.body.email;
        let password = req.body.password;
        let phoneNumber = req.body.phoneNumber;
        let organisationName = req.body.organisationName || 'None';

        const userExists = await User.findOne({where: {email: email}});

        if (userExists) {
            throw new Error('Такий email вже існує.', 400);
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser: UserAttributes = {
            name,
            surname,
            email,
            password: hashedPassword,
            phoneNumber,
            organisationName,
            deliveryCity: '',
            warehouse: ''
        };

        await User.create(newUser);
        return res.status(200).json({message: 'User created successfully'});
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const isAdmin = req.body.isAdmin;

    try {
        if (!errors.isEmpty()) {
            throw new Error('Validation error', 422, errors.array());
        }

        const userCredentials = {
            email: req.body.email,
            password: req.body.password,
        };

        const loadedUser = await User.findOne({
            where: {
                email: userCredentials.email
            }
        });

        if (loadedUser) {
            const isPasswordEqual = await bcrypt.compare(userCredentials.password, loadedUser.dataValues.password);

            if (isPasswordEqual) {
                const token = jwt.sign(
                    {
                        email: loadedUser.dataValues.email,
                        userId: loadedUser.dataValues.id
                    },
                    'somesupersecretsecret',
                    {expiresIn: '1h'}
                );

                res.cookie('token', token, {secure: false, httpOnly: true, maxAge: 900000});
                res.cookie('userId', loadedUser.dataValues.id, {maxAge: 900000});
                return res.status(200).json({userId: loadedUser.dataValues.id, isAdmin});
            } else {
                throw new Error('Невірний пароль або email', 422);
            }
        } else {
            throw new Error('Користувача з таким email не існує');
        }
    } catch (err) {
        next(err);
    }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('token');
    res.clearCookie('userId');
    return res.status(200).end();
};

export const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.cookies.userId;

    const errors = validationResult(req);

    const user = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        organisationName: req.body.organisationName || 'None'
    };

    try {
        if (!errors.isEmpty()) {
            throw new Error('Validation error', 422, errors.array());
        }

        const existingUser = await User.findByPk(userId);
        const updatedUser = await existingUser?.update(user);

        return res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
}

export const updateUserDelivery = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.cookies.userId;

    const userDelivery = {
        deliveryCity: req.body.deliveryCity,
        warehouse: req.body.warehouse,
    };

    try {
        const existingUser = await User.findByPk(userId);
        const updatedUser = await existingUser?.update(userDelivery);

        return res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};


export const sendResetPasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.cookies.userId;
    const email = req.body.email;
    const errors = validationResult(req);

    try {
        if(req.body.isNotAuth){
            return res.status(401).json({isNotAuth: true});
        }

        if (!errors.isEmpty()) {
            throw new Error('Validation error', 422, errors.array());
        }

        const user = await User.findOne({where: {id: userId, email: email}});

        if (!user) {
            throw new Error("Користувача з таким email не існує", 400);
        }

        let token = await Token.findOne({where: {UserId: userId}});

        const currentDate = new Date(new Date().getTime() + 2 * 3600000).getTime();

        if (!token) {
            token = await Token.create({
                UserId: +userId,
                expirationTime: new Date(new Date().getTime() + 600000 + 2 * 3600000),
                token: crypto.randomBytes(32).toString('hex'),
            });
        } else {
            if (new Date(token!.dataValues.expirationTime).getTime() < currentDate) {
                token = await token.update({
                    expirationTime: new Date(new Date().getTime() + 600000 + 2 * 3600000),
                    token: crypto.randomBytes(32).toString('hex')
                });
            }
        }

        const letterText = `http://localhost:3000/new-password/${token.dataValues.token}`;

        await sendEmail(email, 'Зміна пароля', letterText);

        return res.status(200).json({token});
    } catch (err) {
        next(err);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;
    const password = req.body.password;
    const userId = req.cookies.userId;
    const saltRounds = 10;
    let tokenExists;

    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            throw new Error('Validation error', 422, errors.array());
        }

        if(req.body.isNotAuth){
            return res.status(401).json({isNotAuth: true});
        }

        tokenExists = await Token.findOne({
            where: {
                token: token,
                UserId: userId,
            }
        });

        const currentDate = new Date(new Date().getTime() + 2 * 3600000).getTime();

        if(!tokenExists){
            throw new Error("Користувача не існує");
        }

        if (new Date(tokenExists!.dataValues.expirationTime).getTime() < currentDate) {
            throw new Error("Срок дії сесії вичерпано");
        }

        const newHashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.findByPk(userId);

        if(!user){
            throw new Error("Користувача не існує");
        }

        await user.update({password: newHashedPassword});
        await tokenExists.destroy();
        return res.status(200).json(user);
    }catch(err){
        next(err);
    }
};