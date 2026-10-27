import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { handleError } from './middlewares/validation.middleware';
import { prisma } from './config/db';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', async (_req: Request, res: Response) => {
  let database = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = 'connected';
  } catch {
    database = 'disconnected';
  }

  res.status(200).json({
    status: 'ok',
    message: 'API is running 🚀',
    timestamp: new Date().toISOString(),
    database,
  });
});

app.get('/', (_req: Request, res: Response) => {
    res.json({
        name: 'API Starter Kit',
        version: '1.0.0',
        documentation: '/api-docs',
    });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

app.use(handleError);

export default app;