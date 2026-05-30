import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validateRequest, authMiddleware } from '../middleware';
import { registerSchema, loginSchema } from '../validators/auth';

const router = Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register
);

router.post(
  '/login',
  validateRequest(loginSchema),
  authController.login
);

router.get(
  '/me',
  authMiddleware,
  authController.getCurrentUser
);

export default router;
