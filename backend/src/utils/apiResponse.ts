import { Response } from "express";
import { HttpStatus } from "./httpStatus";

export function sendSuccess<T>(res: Response, data: T, message = "Success", statusCode: HttpStatus = HttpStatus.OK): void {
    res.status(statusCode).json({success: true, message, data});
}