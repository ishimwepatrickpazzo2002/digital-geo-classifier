import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { errorHandler } from './middleware';

// Routes
import authRoutes from './routes/auth';
import reportRoutes from './routes/reports';
import dashboardRoutes from './routes/dashboard';

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors({
    origin: env.corsOrigin,
    credentials: true,
  }));
  app.use(morgan('combined'));
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
    });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
