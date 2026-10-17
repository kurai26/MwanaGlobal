import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler, notFound } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import opportunityRoutes from './routes/opportunity.routes';
import applicationRoutes from './routes/application.routes';
import subscriptionRoutes from './routes/subscription.routes';

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: config.app.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many requests from this IP' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Logging
if (config.app.isDev) app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: config.app.nodeEnv });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Public profile route
app.get('/api/profiles/:profileId', async (req, res, next) => {
  const { getPublicProfile } = await import('./controllers/profile.controller');
  return getPublicProfile(req as never, res, next);
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
