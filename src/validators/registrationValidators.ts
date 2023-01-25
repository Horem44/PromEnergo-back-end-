import { body } from "express-validator/check";

const registrationValidators = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({min: 6}),
    body('confirmPassword').notEmpty().isLength({min: 6}).equals('password'),
    body('name').notEmpty().isLength({min: 2}),
    body('surname').notEmpty().isLength({min: 2}),
    body('organisationName').notEmpty().isLength({min: 2}),
    body('phoneNumber').notEmpty().isLength({min: 10}),
]

export default registrationValidators;