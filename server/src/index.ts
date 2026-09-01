import * as Sentry from "@sentry/node";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import seedData from './utils/seeder';

// Initialize Sentry at the very top with EXACT DSN
Sentry.init({
  dsn: "https://3c0396d1f385ccbbd63c92ea08120286@o4511976608890880.ingest.us.sentry.io/4511976673705984",
  tracesSampleRate: 1.0,
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('TechNova API is running...');
});

// Sentry Onboarding Verification Route
app.get('/debug-sentry', async (req, res) => {
  const err = new Error("My first Sentry error!");
  Sentry.captureException(err);
  await Sentry.flush(3000);
  res.status(500).json({ error: "My first Sentry error!", stack: err.stack });
});

// Sentry Error Handler
Sentry.setupExpressErrorHandler(app);

// Custom Error handling middleware
app.use(async (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  Sentry.captureException(err);
  await Sentry.flush(3000);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/technova';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
