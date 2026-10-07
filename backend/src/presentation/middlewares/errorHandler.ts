import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/errors";
import { HttpStatus } from "../../utils/httpStatus";
import { logger } from "../../infrastructure/logger/logger";


export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
    if(err instanceof AppError) {
        if(!err.isOperational) {
            logger.error({err, path: req.path}, "Unexpected operational error");
        } else {
            logger.warn({message: err.message, path: req.path}, "Handled error");
        }
        res.status(err.statusCode).json({ success: false, message: err.message });
        return;
    }

    logger.error({ err, path: req.path }, "Unhandled error");
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Somethign went wrong" });
}