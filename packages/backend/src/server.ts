// --- file: packages/backend/src/server.ts ---
import { env } from './config/env';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import { diagnosisRouter } from './routes/diagnosis';
import { userRouter } from './routes/user';
import { predictionRouter } from './routes/prediction';
import { auth } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import ApiError from './utils/ApiError';

console.log(`✅ Environment loaded for: ${env.NODE_ENV}`);

const app: Express = express();

// --- CORS Configuration ---
// In development, we allow requests from the local frontend.
// In production, we create a dynamic whitelist to allow the deployed Vercel URL
// and any Vercel preview URLs.
let corsOptions: CorsOptions;

if (env.NODE_ENV === 'production') {
  const whitelist = [
    env.FRONTEND_URL, // Your main Vercel URL from .env
    // Regex to match Vercel's dynamic preview URLs for this project
    /^https:\/\/plant-diagnosis-frontend-.*\.vercel\.app$/
  ].filter(Boolean) as (string | RegExp)[];

  corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, curl, etc.) for testing
      if (!origin) return callback(null, true);
      
      const isAllowed = whitelist.some(allowedOrigin => 
        (allowedOrigin instanceof RegExp) ? allowedOrigin.test(origin) : allowedOrigin === origin
      );
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin '${origin}' is not allowed by CORS.`));
      }
    },
    credentials: true,
  };
  console.log('🔒 Production CORS policy enabled.');
  if(env.FRONTEND_URL) {
    console.log(`➡️ Allowing production origin: ${env.FRONTEND_URL}`);
  } else {
    console.warn('⚠️ WARNING: FRONTEND_URL environment variable is not set. Production CORS might fail.');
  }

} else {
  // Development configuration
  corsOptions = {
    origin: env.FRONTEND_URL,
    credentials: true,
  };
  console.log(`🔧 Development CORS policy enabled for: ${env.FRONTEND_URL}`);
}

// Global Middleware
app.use(cors(corsOptions));

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