import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/reportService';
import { successResponse } from '../utils/responses';
import { AppError } from '../utils/errors';

export const dashboardController = {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, 'User not authenticated');
      }
      const stats = await reportService.getDashboardStats(req.user.userId);
      res.json(successResponse(stats));
    } catch (error) {
      next(error);
    }
  },
};
