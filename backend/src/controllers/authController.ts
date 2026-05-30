import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { successResponse } from '../utils/responses';
import type { RegisterInput, LoginInput } from '../validators/auth';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body as RegisterInput;
      const result = await authService.register(input);
      res.status(201).json(successResponse(result, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body as LoginInput;
      const result = await authService.login(input);
      res.json(successResponse(result, 'Logged in successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const user = await authService.getCurrentUser(req.user.userId);
      res.json(successResponse(user));
    } catch (error) {
      next(error);
    }
  },
};
