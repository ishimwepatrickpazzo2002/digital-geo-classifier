import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { authMiddleware, validateRequest } from '../middleware';
import { createReportSchema } from '../validators/reports';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  validateRequest(createReportSchema),
  reportController.createReport
);

router.get('/', reportController.getReports);

router.get('/:id', reportController.getReportById);

router.delete('/:id', reportController.deleteReport);

export default router;
