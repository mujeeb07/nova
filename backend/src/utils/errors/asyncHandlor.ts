import { Request, Response, NextFunction, RequestHandler, response } from "express";

export function asyncHandlor(fn: RequestHandler) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}