import {Error} from "../models/Error";
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: TypeError|Error, req:Request, res:Response, next:NextFunction) => {
    let error = err;

    if (!(err instanceof Error)) {
        error = new Error(
            'Something went wrong'
        );
    }

    return res.status((error as Error).status).json({error});
}

export default errorHandler;