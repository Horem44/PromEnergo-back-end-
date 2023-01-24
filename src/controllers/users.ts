import {User, UserAttributes} from "../models/User";
import {NextFunction, Request, Response} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../routes/users";

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
    }catch (err) {
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
            organisationName
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

                res.cookie('token', token, { maxAge: 900000});
                res.cookie('userId', loadedUser.dataValues.id, { maxAge: 900000});
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