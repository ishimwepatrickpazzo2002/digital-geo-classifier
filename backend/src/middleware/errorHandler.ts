import { Response, NextFunction, Request } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { errorResponse } from '../utils/responses';

export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    logger.error('AppError:', error.message);
    return res.status(error.statusCode).json(errorResponse(error.message));
  }

  logger.error('Unhandled Error:', error.message);
  return res.status(500).json(errorResponse('Internal server error'));
};
