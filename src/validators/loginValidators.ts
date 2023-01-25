import { body } from "express-validator/check";

const loginValidators = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({min: 6}),
]

export default loginValidators;