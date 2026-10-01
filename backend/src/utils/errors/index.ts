import { HttpStatus } from "../httpStatus";
import { AppError } from "./AppError";

export class BadRequestError extends AppError {
    constructor(message = "Bad reqeust") { super(message, HttpStatus.BAD_REQUEST); }
}

export class UnAuthorizedError extends AppError {
    constructor(message = "UnAuthorized") { super(message, HttpStatus.UNAUTHORIZED); }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbiddon") { super(message, HttpStatus.FORBIDDEN); }
}

export class NotFoundError extends AppError {
    constructor(message = "Not found") { super(message, HttpStatus.NOT_FOUND); }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") { super(message, HttpStatus.CONFLICT); }
}

export { AppError }