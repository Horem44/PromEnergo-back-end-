import { body } from "express-validator/check";

const userInfoValidators = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({min: 6}),
    body('name').notEmpty().isLength({min: 2}),
    body('surname').notEmpty().isLength({min: 2}),
    body('organisationName').notEmpty().isLength({min: 2}),
    body('phoneNumber').notEmpty().isLength({min: 10}),
]

export default userInfoValidators;