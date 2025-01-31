import {plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';
import {Request, Response, NextFunction} from 'express';

export const validateDto = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoInstance);
        if (errors.length > 0) {

            const error = errors[0].constraints
            const [primary] = Object.keys(errors[0].constraints)
            return res.status(400).send({
                error: {
                    message: error[primary]
                }
            });
        }
        next();
    };
};