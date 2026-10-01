import { HttpStatus } from "../httpStatus";

export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: HttpStatus,
        public readonly isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}