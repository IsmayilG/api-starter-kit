import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        message: 'API is running 🚀',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

app.get('/', (_req: Request, res: Response) => {
    res.json({
        name: 'API Starter Kit',
        version: '1.0.0',
        documentation: '/api-docs',
    });
});

export default app;