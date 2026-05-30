import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/reportService';
import { successResponse } from '../utils/responses';
import { AppError } from '../utils/errors';
import type { CreateReportInput } from '../validators/reports';

export const reportController = {
  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, 'User not authenticated');
      }
      const input = req.body as CreateReportInput;
      const report = await reportService.createReport(req.user.userId, input);
      res.status(201).json(successResponse(report, 'Report created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getReports(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, 'User not authenticated');
      }
      const reports = await reportService.getReports(req.user.userId);
      res.json(successResponse(reports));
    } catch (error) {
      next(error);
    }
  },

  async getReportById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, 'User not authenticated');
      }
      const { id } = req.params;
      const report = await reportService.getReportById(id, req.user.userId);
      res.json(successResponse(report));
    } catch (error) {
      next(error);
    }
  },

  async deleteReport(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, 'User not authenticated');
      }
      const { id } = req.params;
      await reportService.deleteReport(id, req.user.userId);
      res.json(successResponse(null, 'Report deleted successfully'));
    } catch (error) {
      next(error);
    }
  },
};
