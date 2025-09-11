// --- file: packages/backend/src/server.ts ---
import { env } from './config/env';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { diagnosisRouter } from './routes/diagnosis';
import { userRouter } from './routes/user';
import { predictionRouter } from './routes/prediction';
import { auth } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import ApiError from './utils/ApiError';

console.log(`✅ Environment loaded for: ${env.NODE_ENV}`);

const app: Express = express();

// Global Middleware
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Global body parsers - CRITICAL for middleware consistency
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint (public)
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- API ROUTES ---
app.use('/api/diagnose', diagnosisRouter);
app.use('/api/user', auth, userRouter);
app.use('/api/predict', predictionRouter);

// --- ERROR HANDLING ---
// Handle 404 for any routes not found
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// Global error handler - MUST be the last middleware
app.use(errorHandler);

export default app;