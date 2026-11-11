export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    
    // Identifies trusted operational errors (e.g., validation failure) 
    // versus unexpected programming bugs (e.g., undefined variable crashes)
    this.isOperational = true;

    // Captures the current stack trace without including this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}
