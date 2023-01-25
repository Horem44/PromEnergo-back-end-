import {User, UserAttributes} from "../models/User";
import {NextFunction, Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../util/sendEmail";
import * as crypto from "crypto";
import {Token} from "../models/Token";

export const getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.cookies.userId;

    try {
        const user = await User.findByPk(userId);
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saltRounds = 10;

        let name = req.body.name;
        let surname = req.body.surname;
        let email = req.body.email;
        let password = req.body.password;
        let phoneNumber = req.body.phoneNumber;
        let organisationName = req.body.organisationName || 'None';

        const userExists = await User.findOne({where: {email: email}});

        if (userExists) {
            return res.status(401).json({message: 'Такий email вже існує.'});
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

        const record = User.create(newUser);
        return res.status(200).json({message: 'User created successfully'});
    } catch (err) {
        return res.status(401).json({message: 'User creation failed'});
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
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

                res.cookie('token', token, {maxAge: 900000});
                res.cookie('userId', loadedUser.dataValues.id, {maxAge: 900000});
                res.status(200).json({userId: loadedUser.dataValues.id});
            } else {
                return res.status(401).json({message: 'Невірний пароль або email'});
            }
        } else {
            return res.status(401).json({message: 'Користувача з таким email не існує'});
        }
    } catch (err) {
        console.log(err);
    }
};

export const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.cookies.userId;

    const user = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        organisationName: req.body.organisationName || 'None'
    };

    try {
        const existingUser = await User.findByPk(userId);
        const updatedUser = await existingUser?.update(user);

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
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

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
    }
};


export const sendResetPasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.cookies.userId;
    const email = req.body.email;

    try {
        const user = await User.findOne({where: {id: userId, email: email}});

        if (!user) {
            return res.status(400).json({message: "user with given email doesn't exist"});
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

        const letterText = `http://localhost:8080/reset/${token.dataValues.token}`;

        await sendEmail(email, 'Зміна пароля', letterText);

        return res.status(200).json({token});
    } catch (err) {
        console.log(err);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;
    const password = req.body.password;
    const userId = req.cookies.userId;
    const saltRounds = 10;
    let tokenExists;

    try {
        tokenExists = await Token.findOne({
            where: {
                token: token,
                UserId: userId,
            }
        });

        const currentDate = new Date(new Date().getTime() + 2 * 3600000).getTime();

        if(!tokenExists){
            return res.status(401).json('No such user');
        }

        if (new Date(tokenExists!.dataValues.expirationTime).getTime() < currentDate) {
            return res.status(401).json('Token expired');
        }

        const newHashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.findByPk(userId);

        if(!user){
            return res.status(401).json('No such user');
        }

        await user.update({password: newHashedPassword});

        return res.status(200).json(user);
    }catch(err){
        console.log(err);
    }
};